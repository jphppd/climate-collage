#!/usr/bin/env python3
"""Generate final documentation and data from sources."""

from collections import defaultdict
from itertools import chain
import json
from operator import itemgetter
from pathlib import Path
from textwrap import wrap
import subprocess

import htmlmin
from jinja2 import Environment, FileSystemLoader

SRC_DATA = Path("../data").absolute()
PUBLIC_DATA = Path("../website/public/data").absolute()
DOC_DATA = PUBLIC_DATA / "dl"

if not SRC_DATA.exists():
    raise FileNotFoundError(f'${SRC_DATA} cannot be found')

if not PUBLIC_DATA.exists():
    PUBLIC_DATA.mkdir(parents=True)
if not DOC_DATA.exists():
    DOC_DATA.mkdir(parents=True)

TRANSLATIONS_JSON = PUBLIC_DATA / "content" / "translations.json"
GRAPH_JSON = PUBLIC_DATA / "content" / "graph.json"

REL_TYPES = {"major", "minor", "false", "simplified"}

AVAIL_LANGUAGES = ("fr", "en", "de", "es")


class Edge:
    """Edge interface."""

    def __init__(self, **kwargs):
        """Init the object."""
        self.ffrom = kwargs["from"]
        self.to = kwargs["to"]
        self.relation = kwargs["relation"]

    def render_visjs(self):
        """Render as dict, dedicated to website."""
        return {
            "from": self.ffrom,
            "to": self.to,
            "relation": self.relation,
        }


class Node:
    """Node interface."""

    def __init__(self, **kwargs):
        """Init the object."""
        self.id = kwargs["id"]
        self.batch = kwargs["batch"]
        self.x = kwargs["x"]
        self.y = kwargs["y"]
        self.origins = None
        self.effects = None
        self.title = {}
        self.info = {}
        self.more_info = {}

    def _render_base(self):
        """Render common items as dict."""
        return {
            'id': self.id,
            'batch': self.batch,
            'relations': {'origins': self.origins, 'effects': self.effects},
        }

    def render_visjs(self):
        """Render as dict for visjs."""
        return {
            **self._render_base(),
            'x': self.x * 115,
            'y': self.y * 115,
        }

    def render_doc(self, language, snake_case=True):
        """Render as dict for generic documentation, with info, more_info, etc."""
        out = {
            **self._render_base(),
            'title': self.title[language],
            'info': self.info[language],
            'wrapped_title': '\\n'.join(wrap(self.title[language], width=17)),
            'more_info': self.more_info[language],
        }
        if not snake_case:
            out['wrappedTitle'] = out.pop('wrapped_title')
            out['moreInfo'] = out.pop('more_info')
        return out


def get_relations(edges):
    """Create cards relations in a dict with card_ids keys."""
    cards_rel = defaultdict(
        lambda: {
            'origins': {rel: [] for rel in REL_TYPES},
            'effects': {rel: [] for rel in REL_TYPES},
        }
    )
    for importance in REL_TYPES:

        for edge in edges[importance]:
            cards_rel[edge.ffrom]['effects'][importance].append(edge.to)
            cards_rel[edge.to]['origins'][importance].append(edge.ffrom)

    return cards_rel


def fill_nodes_with_text(nodes, language):
    """Fill the nodes with text elements (information, titles, etc.)."""

    with (SRC_DATA / language / 'node_names.json').open() as names_fh:
        titles = json.load(names_fh)

    for node in nodes:
        node.title[language] = titles[node.id]

        with (SRC_DATA / language / f'node_info_{node.id}.html').open() as info_fh:
            node.info[language] = htmlmin.minify(info_fh.read(), remove_all_empty_space=True)

        with (SRC_DATA / language / f'node_moreInfo_{node.id}.html').open() as info_fh:
            node.more_info[language] = htmlmin.minify(info_fh.read(), remove_all_empty_space=True)


def build_data(known_languages):
    """Build primary objects edge_struct and nodes from graph_base."""
    with (SRC_DATA / 'graph_base.json').open() as base_fh:
        primary_data = json.load(base_fh)

    edge_struct = {}
    for relation, edges in primary_data['edges'].items():
        edge_struct[relation] = [Edge(relation=relation, **edge) for edge in edges]
    cards_rel = get_relations(edge_struct)

    nodes = [Node(**node) for node in primary_data['nodes']]

    for node in nodes:
        node.origins, node.effects = itemgetter('origins', 'effects')(cards_rel[node.id])

    for language in known_languages:
        fill_nodes_with_text(nodes, language)

    return edge_struct, nodes


def render_translations(nodes):
    """Render the json translations' file."""
    formatted_nodes = {}
    translation = {}

    for language in AVAIL_LANGUAGES:
        formatted_nodes[language] = {node.id: node.render_doc(language) for node in nodes}

        with (SRC_DATA / language / 'component_names.json').open() as comp_fh:
            translation[language] = json.load(comp_fh)
        translation[language]['nodes'] = {
            node.id: node.render_doc(language, snake_case=False) for node in nodes
        }

    with TRANSLATIONS_JSON.open('w') as translations_fh:
        json.dump(translation, translations_fh, sort_keys=True, indent=2)


def render_html(file_basename, nodes, language):
    """Render the html version of the documentation."""
    j2_env = Environment(loader=FileSystemLoader('templates'))
    template = j2_env.get_template(f'{file_basename}.html.j2')
    rendered_template = template.render(
        cards=[node.render_doc(language) for node in nodes], language=language
    )

    with (DOC_DATA / f'{file_basename}_{language}.html').open('w') as html_fh:
        html_fh.write(rendered_template)


def render_pdf(file_basename, language):
    """Render the pdf version of the documentation."""
    wkhtmltopdf_options = (
        '--margin-bottom',
        '17',
        '--margin-left',
        '7',
        '--margin-right',
        '7',
        '--margin-top',
        '17',
    )
    command = (
        'wkhtmltopdf',
        *wkhtmltopdf_options,
        DOC_DATA / f'{file_basename}_{language}.html',
        DOC_DATA / f'{file_basename}_{language}.pdf',
    )
    print(' '.join(map(str, command)))
    subprocess.run(command, cwd=DOC_DATA, check=True)


def render_visjs(edges, nodes):
    """Render the enhanced version of the graph."""

    graph_data = {
        # Flatten edges dict
        'edges': [edge.render_visjs() for edge in chain(*edges.values())],
        'nodes': {node.id: node.render_visjs() for node in nodes},
    }

    with GRAPH_JSON.open('w') as graph_fh:
        json.dump(graph_data, graph_fh, sort_keys=True, indent=2)


def render(edges, nodes):
    """Render all elements."""
    render_visjs(edges, nodes)
    render_translations(nodes)

    for language in AVAIL_LANGUAGES:
        file_basename = 'documentation'
        render_html(file_basename, nodes, language)
        render_pdf(file_basename, language)


def main():
    """Entry point."""
    edges, nodes = build_data(AVAIL_LANGUAGES)

    render(edges, nodes)


if __name__ == '__main__':
    main()
