# One Server, Two Solid File Browser Applications

## Background

[Previously](../01-one-server/README.md), Oregon state's government provisoned a WebID and a Pod, which the state calls a _Secure Data Store_, to each of its residents.
Alice and Bob logged in the state's Solid server,
and Alice successfully managed to share a picture with Bob.

When the state introduced the PASS project to its residents, it raved about all the benefits:

* Improved data privacy
* Data portability
* Access control transparency
* And many more ... _But who reads long emails?_

However, Alice distinctly remembers reading how her WebID, Pod, and the applications that interface with either of these are separate by design.
She heard her boring engineering friends talk about the beauty of [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) over beers.
_Snooze!_

Nevertheless, Alice finds the state's user interface a bit boring.
After a bit of searching, she finds some Solid-related resources on the state's web site.
Among some of the state-recommend file browsing applications for Pods, she sees the Solid File Manager:

* GitHub: <https://github.com/Otto-AA/solid-filemanager>
* Hosted: <https://otto-aa.github.io/solid-filemanager/>

A seasonal stout in hand, she selects the link to the hosted application.
_Learning. Yay._

## Setup

* Follow the previous experiment's setup
* Be sure to have the Community Solid Server running before attempting to follow along

## Alice

### A Shiny New File Browser

After navigating to <https://otto-aa.github.io/solid-filemanager/>, Alice is prompted to identify her Solid ID provider.
Oregon state provided her with a WebID, so the URL of the state's Solid server is what she should enter.
She enters `http://localhost:3000` and selects "LOGIN".

Alice is redirected to the familiar log in page on the state's Solid server.
She enters her credentials, `alice@example.com` and `test`, respectively.
She is immediately prompted to grant read and write authorization to the Solid File Manager application,
and she goes ahead and grants the application permission to her.

**Note 1: Alice is able to see that the Solid File Manager wants permission to write to her pod. If she wasn't comfortable with this, she could cancel the request at this stage.**

**Note 2: Imagine a use case where Alice didn't have a WebID yet. She could create an ID here and now. Cool.**

**Technical Note: the client-side JavaScript of the Solid web applications require Cross-Origin Resource Sharing.**

Alice likes the simple look of this file browsing application!
As an added bonus, Alice _thinks_ shes starting to see the power of having a Pod:
her Pod is her central data store, not the application's!
She can take her data to whatever application she wants.
Gone are the days of having your data tied to a specific service or application!
Her inner libertarian smirks.

***Fin.***
