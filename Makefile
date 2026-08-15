.PHONY: help docs docs-install docs-serve docs-clean typecheck test lint check ci

# Uniform entry points. CI invokes these same targets, so local green and CI
# green cannot drift.

help:
	@echo "docs-install  install site dependencies (npm ci)"
	@echo "docs          build the static site into docs-site/build"
	@echo "docs-serve    run the dev server with hot reload"
	@echo "typecheck     tsc over the site sources"
	@echo "check         typecheck + docs (what CI gates on)"

docs-install:
	cd docs-site && npm ci

docs:
	cd docs-site && npm run build

docs-serve:
	cd docs-site && npm run start

docs-clean:
	rm -rf docs-site/build docs-site/.docusaurus docs-generated

typecheck:
	cd docs-site && npm run typecheck

# This repo's "tests" are the build and the type-checker: the site either
# renders every artifact without a broken link or it does not. A docs template
# with a mock suite and no build gate would be testing the wrong thing.
test: typecheck docs

# gitleaks is also run as its own CI job from the shared stump.wtf/ci workflow;
# this target exists so the same scan is one command locally.
lint:
	gitleaks git . --redact

check: typecheck docs

ci: check
