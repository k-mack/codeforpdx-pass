//
// This script models how a Node.js application can
//   1. Log into a user's account
//   2. Fetch a file from another pod that the logged in user has access to
//
// For this to work,
//   1. The user being impersonated by the Node.js application must have the application as a "trust app" in her pod.
//   2. The file being read by the application by be accessible by the impersonated user.
//
// Therefore, we could
//   1. Create a POD user for the PASS ecosystem.
//   2. Create a server-side Node.js application that impersonates the PASS user.
//   3. When an "individual" uploads a file via PASS to her POD, PASS adds the PASS user to the files ACL file
//

import { SolidNodeClient } from "solid-node-client";
import { appCredentials } from "./app-identity.js";
import { individual } from "./individual.js";
import * as solidClient from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

// Create SolidNodeClient object
// This object will manage the application's solidNodeClient connection with its POD
const solidNodeClient = new SolidNodeClient();
//    {
//    handlers: { https: "solid-client-authn-node" },
//}

// Log into the app user's profile
// TODO: this should use JWT auth instead
console.log("\nLogging into app's user ...\n");
let appUserSession = await solidNodeClient.login({
  idp: appCredentials.idp,
  username: appCredentials.username,
  password: appCredentials.password,
});

// Display feedback: did we log into the app user's account successfully?
if (!appUserSession.isLoggedIn) {
  console.log("Failed to log in. Check appCredentials.");
  process.exit(1);
} else {
  console.log(
    "Success! Below is the solidNodeClient appUserSession that was just created:\n"
  );
}

// Display appUserSession object (for debugging purposes)
console.dir(appUserSession, { depth: null });
console.log();

// Read file from another POD that the app user should have read access to
console.log(
  "As the app user, fetching `random-tweet.ttl` from the individual's POD ...\n"
);
let readResponse = await solidNodeClient.fetch(
  `${individual.idp}/random-tweet.ttl`
);

// Display the file's contents (for debugging purposes)
console.log(await readResponse.text());

// As the app user, write to a non-RDF resource to the individual's POD
console.log(
  "As the app user, write text to `/pass/test.txt` in the individual's POD ...\n"
);
let writeResponse = await solidNodeClient.fetch(
  `${individual.idp}/pass/test.txt`,
  {
    method: "PUT",
    body: "This is a test",
    headers: { "Content-type": "text/plain" },
  }
);

// Display the returned status code (for debugging purposes)
console.log(
  `Operation ${
    writeResponse.status >= 200 && writeResponse.status < 300
      ? "successful"
      : "failed"
  }! (status code = ${writeResponse.status})\n`
);

let courseSolidDataset = solidClient.createSolidDataset();
const newBookThing1 = solidClient
  .buildThing(solidClient.createThing({ name: "book1" }))
  .addStringNoLocale(SCHEMA_INRUPT.name, "ABC123 of Example Literature")
  .addUrl(
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "https://schema.org/Book"
  )
  .build();

console.dir(newBookThing1, { depth: null });

// Add Thing to the SolidDataset
courseSolidDataset = solidClient.setThing(courseSolidDataset, newBookThing1);

// Save SolidDataset
const savedSolidDataset = await solidClient.saveSolidDatasetAt(
  `${individual.idp}/pass/Writing101.ttl`,
  courseSolidDataset,
  { fetch: appUserSession.fetch }
);

console.dir(savedSolidDataset, { depth: null });

// As the app user, get a dataset from the individual's POD
// const passDataset = await solidClient.getSolidDataset(
//   `${individual.idp}/pass`,
//   { fetch: solidNodeClient.fetch }
// );
//
// console.log(passDataset);

await solidNodeClient.logout();
