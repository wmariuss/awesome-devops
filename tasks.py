import os
from invoke import task, call


@task
def build(c):
    """Build the website"""
    c.run("cp README.md docs/list.md")
    c.run("mkdocs build")
