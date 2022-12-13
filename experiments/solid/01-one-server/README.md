# Two Users, One Server

## Background

The state government of Oregon has invested in a new program called PASS.
Through this program, every Oregonian will be given a Secure Data Store to server as the home for their personal data,
with the ability to determine who has access to data within it and when.
The technical implementation of this program uses Solid Pods.

Alice and Bob are friends.
They both use Google Drive to share documents with each other, but neither of them like that service's Terms of Service.
They want the benefits of cloud storage, while truly owning their data!
They decide to experiment with the government-provided Secure Data Store.

## Setup

### Run Community Solid Server

In this experiment, both users, Alice and Bob, are using the same
Identity Provider (IDP),
Pod Provider,
and Application.
All three of these services are hosted by the government of Oregon on the same server.

To simulate this, the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer) is used.
This server acts as both an IDP and a Pod Provider.
[Penny](https://gitlab.com/vincenttunru/penny) is used as an NPM dependency to provide (an experimental) data browser for Pods hosted on the server.
In short, the setup here runs an IDP, a Pod Provider, and an application (i.e., Penny).

Run the following to start the single server, which acts as Oregon's "one server" in this experiment:

```bash
# Clean install project
npm ci --production

# Create directory to store the Solid server's data (this simulates the government's data storage)
mkdir govt-server-data-dir

# Host the Community Solid Server with Penny on http://localhost:3000
npx community-solid-server --config config-penny.json --rootFilePath govt-server-data-dir --loggingLevel info --port 3000
```

### Create User Accounts

Alice and Bob will need accounts on the Solid server to use it.
Let's act as the government of Oregon and create accounts for them:

1. Open a web browser, navigate to <http://localhost:3000>.
2. Select "Connect Pod" in the upper right.
3. Select "Connect".
4. We can't log in to any user yet, so select "Sign up".

Let's create an account for Alice first:

1. Select "Create a new WebID for my Pod."
2. Enter `alice-pod1` for the Pod name.
3. Enter `alice@example.com` for the email.
4. Enter `test` for the password. (And again for the confirmation.)

Repeat these steps for Bob.
Use values of `bob-pod1`, `bob@example.com`, and `test`, respectively.

We now have two users in the system who both have pods.
The Community Solid Server is a bit weird in the sense that the WebID provisioned uses the Pod name.
We will do soemthing different in another experiement to make this more like the real world.
For now, however,
Alice's government-hosted Pod is at <http://localhost:3000/alice-pod1/>,
and Bob's is at <http://localhost:3000/bob-pod1/>.


## Permission Denied by Default

Alice and Bob both receive an email from the government of Oregon detailing their account setup.

Alice opens the email, sees the link to her account (<http://localhost:3000/alice-pod1/>), and selects it.
Without logging in, she sees that her `profile/` resource under "Contained resources" is visible, which concerns her.
_"Can anybody with this link see my profile?!"_
She selects the resource and to her pleasure she sees that does not have permission to view the resource.
_Phew!_

After logging in, as expected she can see profile, but not Bob's.

## Alice

Alice has found a funny picture of a beagle wearing sunglasses.
She thinks Bob could use a laugh and wants to share it with him.

She does the following:

1. Logs into her Secure Data Store.
2. Uploads the picture.
3. Selects the new resource in the Pod that represents the picture.
4. Copies the URL in the web browser (i.e., <http://localhost:3000/alice-pod1/beagle-wearing-sunglasses.webp>)
5. Sends Bob the URL.

## Bob

Bob returns home after enjoying a long hike in Oregon's backcountry.
He checks his email and sees that Alice sent him an email:

_"Hey Bob! I hope you made it home safe. Check out this cute dog! <http://localhost:3000/alice-pod1/beagle-wearing-sunglasses.webp>"_

Bob selects the link.

_You do not have permission to view this Resource._

Bob remembers that he should probably be logged in to see the picture.
For the picture to be shared without Bob logging in, Alice for have had to make the picture readable by _everyone_.
Alice is way too private of a person to do that!
Bob logs in and selects the link again.

_You do not have permission to view this Resource._

Now Bob realizes that Alice didn't even grant him access to the picture.
Bob emails Alice back saying that she needs to give him permission to view the picture.

## Alice

Alice receives Bob's email and confirms that she didn't adjust the picture's _Access Control List_.

She does the following:

1. Logs into her Secure Data Store.
2. Selected `Access Control List` under "Linked Resources".
3. Scrolls down to `.acl#public`, toggles on `Contained Resources`, and toggles off `Everyone` in the "To" field, and enters `http://localhost:3000/bob-pod1/profile/card#me` in the "And Agents" field.

She crosses her fingers and writes Bob back saying he should now have read access to the picture.
She heads into the kitchen to find a delicious stout.
It's been a long day of learning Oregon's new Secure Data Stores.

## Bob

As Bob's finishing a refreshing pilsner, he receives the update from Alice.
He selects the link she sent before,
and to his surprise, it worked!
He sees a beagle wearing sunglasses.
_It is cute!_

It's been a long day, with the hike and all.
But he sits back and thinks, _Secure Data Stores are kind of neat_.

***Fin.***
