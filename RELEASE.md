# Release and verification

Source repository: https://github.com/kprojectship/n8n-nodes-veilstrat
Product: https://www.veilstrat.com/
API overview: https://www.veilstrat.com/developers
API reference: https://app.veilstrat.com/docs/api

## Current status

The source compiles, passes n8n's strict community-node lint rules, and passes 17 local tests covering the API contract, actual n8n expression evaluation, masked credential configuration, and input validation. These checks do not establish successful authenticated execution against a live VeilStrat account or n8n Cloud verification.

Before submission, run the sample workflow in n8n using an eligible VeilStrat account and check health, usage, the filter catalog, a narrow company search, one returned dossier and a catalog-backed slice. Do not include the key or company research results in the public repository.

## Publish

1. Confirm ownership of the npm package name `n8n-nodes-veilstrat`.
2. Configure npm publishing using an eligible npm account. For an initial release, configure a narrowly scoped npm publishing token as the repository's `NPM_TOKEN` Actions secret when required. Do not place tokens in source or chat.
3. Run the **Publish** GitHub Actions workflow, or push the tag `v0.1.0`. The workflow runs lint, build and tests, then publishes with provenance.
4. Verify that npm shows version 0.1.0, the correct source repository, README, MIT license and provenance attestation.
5. Configure npm Trusted Publishing for owner `kprojectship`, repository `n8n-nodes-veilstrat` and workflow `publish.yml` when available. Remove the fallback token after confirming trusted publishing works.
6. Run `npx @n8n/scan-community-package n8n-nodes-veilstrat` against the actual published release. Inspect its reported result; the CLI's exit code alone is not enough.

## Submit to n8n

Use https://creators.n8n.io/nodes after the npm release exists and the live workflow has been tested. Supply the npm package name, repository URL and documentation. Do not mark live testing or publication as complete until verified.

Suggested summary:

> VeilStrat connects company funding, AI hiring and technology-adoption research to n8n workflows and AI agents. Search a bounded page of companies, retrieve company dossiers, query signal slices, discover supported filters and inspect API usage. Each user connects their own VeilStrat team API key. API access requires VeilStrat Pro with the API Access add-on. The MIT-licensed node has no runtime dependencies and makes requests only to app.veilstrat.com.

Support: support@veilstrat.com

## Next integrations

After the first submission, continue with Dify, Activepieces and Pipedream. WordPress, RapidAPI and Make remain in the requested queue. Reuse the same endpoint contract and documentation links, but test each platform's native integration rather than treating this node as interchangeable with it.
