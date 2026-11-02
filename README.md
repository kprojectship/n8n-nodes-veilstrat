# n8n-nodes-veilstrat

Research company funding, AI hiring and technology adoption with [VeilStrat](https://www.veilstrat.com/) inside n8n. Find accounts matching a signal query, retrieve company dossiers and use filtered signal slices in prospect research workflows.

This is a community node for [n8n](https://n8n.io/), published by VeilStrat. The integration is MIT-licensed. VeilStrat API access is a separate paid service requiring Pro with the API Access add-on.

## Installation

Once the package is published, self-hosted n8n users can install `n8n-nodes-veilstrat` from **Settings > Community Nodes > Install**. Availability in n8n Cloud requires separate approval through n8n's verified community node program. This source package does not claim that approval has been granted.

## Credentials

1. Open [VeilStrat](https://app.veilstrat.com/) and use **Settings > API** to create a team API key.
2. Add a **VeilStrat API** credential in n8n and enter the key in the password field.
3. Test the credential. The integration checks `/health`, which is exempt from the API request budget.

Read the [API overview](https://www.veilstrat.com/developers) and [authentication documentation](https://app.veilstrat.com/docs/api). Never put keys in workflow parameters, exported workflows or version control.

## Operations

| Resource | Operation | Purpose |
| --- | --- | --- |
| Company | Search | Request one page using a signal query and optional country codes |
| Company | Get | Retrieve the dossier for a company UUID |
| Signal Slice | Search | Request a slice with a minimum score and optional countries |
| Account | Get Filters | Discover current query rules, tool identifiers and slices |
| Account | Get Health | Check API connectivity |
| Account | Get Usage | Inspect quotas and reset times |

## Example workflow

Import `examples/research-companies.json`, select your own credentials and start with Account > Get Filters to inspect supported query values. Company > Search defaults to `signal:hiring:30d`, page 1 and 10 records. Optional countries use comma-separated two-letter codes such as `US,GB`. Search for one page, inspect the response, then use the returned UUID with Company > Get for a company worth researching.

Company search and slice search preserve the full JSON response, including pagination metadata. To process individual records, use n8n's Split Out node on `companies` or `data`, according to the response actually returned. The integration supports both documented response envelopes without discarding metadata.

The node can also be selected as an AI agent tool. Keep the agent's result count small and inspect Account > Get Usage before expanding research. Configure native n8n Webhook nodes separately to receive VeilStrat firehose events; this package does not create or subscribe to webhooks.

## Usage and errors

Requests use the account's normal API quotas. There is no automatic pagination or custom retry loop. Page sizes are limited to 1–50 and company-search offsets to fewer than 500 records. Each input item makes a separate request, so a large input list can consume quota. Keep n8n's **Retry On Fail** setting disabled unless you have deliberately accounted for metered repeats.

401 means the API key was rejected. 403 means the account or key lacks eligible API access. 404 means the company or slice was not found. 422 means query or filter validation failed. 429 means a quota was reached: stop and inspect the error, retry header, reset time and Account > Get Usage. Network and server errors remain errors, rather than becoming empty results.

See [endpoint reference](https://app.veilstrat.com/docs/api/endpoints), [query examples](https://app.veilstrat.com/docs/api/examples) and [rate limits](https://app.veilstrat.com/docs/api/rate-limits).

## Interpreting signals

Hiring-derived technology signals indicate hiring demand, not confirmed production deployment. Funding is a financing event, not proof of budget for your product. VeilStrat scores prioritize research; they are not purchase probabilities.

## Privacy

The node sends the requested queries, country filters, slice filters and company UUIDs to `https://app.veilstrat.com/api/v1`. The API key is transmitted as a bearer header. n8n stores credentials according to its own credential configuration. No analytics, telemetry, filesystem access or environment-variable access is included in the node. Execution output may be retained by your n8n instance according to your settings. Read [VeilStrat's privacy policy](https://www.veilstrat.com/privacy-policy).

## Development

Use Node.js 22 or later. Run `npm ci`, `npm run lint`, `npm run build` and `npm test`. Use `npm run dev` to test the node in n8n. Publishing must use the supplied GitHub Actions workflow with npm provenance before requesting n8n verification.

## Support

Contact [support@veilstrat.com](mailto:support@veilstrat.com) with the package version and reproducible steps. Do not include API keys or customer data.

[VeilStrat](https://www.veilstrat.com/) · [Signals API](https://www.veilstrat.com/developers) · [AI hiring signals](https://www.veilstrat.com/signals/hiring) · [Funding research](https://www.veilstrat.com/funding)
