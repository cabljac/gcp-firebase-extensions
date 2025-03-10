This extension helps developers to set up their frontend clients to subscribe to BQ queries that periodically refresh on a scheduled basis. A canonical use case is election results, where you might have a frontend that needs to refresh live to show the latest results. This extension would be useful in any scenario where an app developer needs to push analytical data back to users.

To use the extension, developers will configure a specific Firestore document for each query and have their frontends listen for updates, and the BigQuery table/query to execute. In the background, BigQuery will run the query on a schedule, and the extension will write the result back to the specified document. Schedules are managed as Transfer Configs using the [Data Transfer Service](https://cloud.google.com/bigquery/docs/scheduling-queries).

Upon installation, a Transfer Config is created for you via the Data Transfer Service API. This Transfer Config will be updated if you update the extension parameters for the instance.

If you would like to specify multiple queries at different intervals, you can create multiple instances of the extension.

The extension will provide a Pub/Sub trigger that listens to new messages written to the specified topic, representing transfer run completion events.

The extension will parse the message to identify the correct destination table based on the runtime. It will then run a “SELECT \*” query from the destination table and write the results (as JSON) to Firestore.

Each run will write to a document with ID “latest”:

```
COLLECTION: transferConfigs/<configId>/runs/latest
DOCUMENT: {
  runMetadata: { },
  totalRowCount: 779,
  failedRowCount: 0,
  latestRunId: 648762e0-0000-28ef-9109-001a11446b2a
}
```

Each run will also write to a “runs” subcollection with runID as the document ID, to preserve history:

```
COLLECTION: transferConfigs/<configId>/runs/<runId>
DOCUMENT: {
  runMetadata: { },
  totalRowCount: 779,
  failedRowCount: 0
}
```

Query results will be stored as individual documents in a subcollection under the run document (i.e. transferConfigs/<configId>/runs/<runId>/output). Frontend applications can subscribe to the “latest” document to listen for changes to latestRunId, and run an additional Firestore query to get the BQ query results as individual documents.

**Additional Setup**

Make sure that you've set up a [Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

You will also need a BigQuery instance with a dataset that contains at least one table.

## Billing

To install an extension, your project must be on the Blaze (pay as you go) plan.

You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).

This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:

- Cloud Pub/Sub
- Cloud Firestore
- BigQuery
- Cloud Functions (See [FAQs](https://firebase.google.com/support/faq#extensions-pricing))

> ⚠️ Note: The extension does not delete the BigQuery Transfer Config (scheduled query) automatically when you uninstall the extension.
>
> BigQuery charges by data processed, so your project will continue to incur costs until you manually delete the scheduled query. You can manage your scheduled queries directly in [Cloud Console](https://console.cloud.google.com/bigquery/scheduled-queries).
