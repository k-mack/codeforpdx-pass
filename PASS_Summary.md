# PASS - Personal Access System for Services

## Description

In Portland, housing insecure individuals struggle to maintain documentation, which is often required to receive government and/or non-profit services. With PASS, we are building out an application to enable the home insecure to store their personal documents online in decentralized data stores, called Pods. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their documents. Verified organization will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individuals pod.


## Terminology

* Individual - housing insecure person using services to interact with organizations.
* Organization - housing agencies, landlords, government agencies that will be requesting information from individuals.
* Pod/Wallet - decentralized data/document storage built with Solid API. Individuals and organizations will have certain functionality within their pods.
* Folder/Container - referring to organization of document data into ttl files using Solid API with Inrupt library.


## User Flows

1. Individual
    * Upload and Maintain Documents
    * Able to share documents
    * Can copy verified documents into pod from organization(s)
2. Organization
    * Can request and review documents
    * Can create verified documents
    * Able to share verified documents with individuals
    * Might require several users

## If you're new to the team, check out our [on-boarding](onboarding.md) steps.

## Tech Overview

Currently building out use-cases in vanilla JavaScript to determine Solid and Inrupt functionality. Once we have proof of concept, we will build out the PASS application in React.

### Solid Data Pods

Pods are like secure personal web servers for data.

#### General User Flow of Solid Pods:
* User registers for a WebID (kind of like an email address)
* User data remains in pod (which is associated to WebID)
* User authorizes applications to read/write/control data in pod

#### To become familiar with how pods work:
* Go to [Kevin's Solid Experiment](https://github.com/codeforpdx/PASS/tree/km/solid/experiments/experiments/solid) on GitHub.
* Clone repository and follow the [instructions](https://github.com/codeforpdx/PASS/tree/km/solid/experiments/experiments/solid/01-one-server).
* Feel free to play around with the pod and check out the second use case [here](https://github.com/codeforpdx/PASS/tree/km/solid/experiments/experiments/solid/02-different-file-browser-application).

### Inrupt JavaSctipt Client Libraries

Inrupt is currently leading the way for development with Solid. Check out their documentation [here](https://docs.inrupt.com/developer-tools/javascript/client-libraries/)

### RDF (Resource Description Framework) and Turtle (ttl files)

The Resource Description Framework (RDF) is a framework for expressing information about resources. Resources can be anything, including documents, people, physical objects, and abstract concepts. RDF is intended for situations in which information on the Web needs to be processed by applications, rather than being only displayed to people. Read more about RDF [here](https://www.w3.org/TR/rdf11-primer/). See how RDF is used within Solid [here](https://solidproject.org/developers/vocabularies/well-known/core).

There is a textual syntax for RDF called Turtle that allows an RDF graph to be completely written in a compact and natural text form, with abbreviations for common usage patterns and datatypes. Read more on the Turtle spec [here](https://www.w3.org/TR/turtle/)

With PASS we are looking into using RDF to link between pods and store metadata in turtle files. We are exploring the use of ttl files to enable organizations to query into an individuals pod to see if certain documents are present, while restricting access to the documents themselves.


### The Team

|Back-End Dev Team    | Front-End Dev Team    | UX/UI Team | Project Management Team |
| ------------------- | --------------------- | -----------| ------------------------|
| Team Lead - Kevin M.| Team Lead - Jared K.  | Gabby      | Flo                     |
|                     |                       | Kyle       | Danica                  |
|                     |                       |            | Wilfred                 |
|                     |                       |            | Katherine               |
|                     |      



## Check out the documentation:
* [Solid Data Pods](https://solidproject.org/developers/tutorials/getting-started)
* As noted above, [Inrupt](https://docs.inrupt.com/developer-tools/javascript/client-libraries/) provides JavaScript client libraries to help developers create Solid applications. Will be used to upload and query data in pods. Data will be stored in `ttl` files.
* [Inrupt Access Requests and Grants](https://docs.inrupt.com/ess/latest/security/access-requests-grants/)
    * Further documentation on building an [access timer](https://solid.github.io/data-interoperability-panel/specification/#access-authorization%E2%91%A0) to a pod 
* [`solid-ui-react`](https://solid-ui-react.docs.inrupt.com/?path=/story/intro--page), a React library to make development with Solid simple(ish lol).