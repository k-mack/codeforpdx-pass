# FileNow: Design Document

## Overview

FileNow offers a risk-mitigated solution to simplify
storing and locating files across multiple cloud storage providers
and sharing the dispersed cloud files with others.
The intended audience for this document is the PASS team.
Readers do not need a technical background.

## Problem

The current PASS solution using the Solid ecosystem is attempting to solve the following problem:

* Individuals who are seeking social services are unable to preserve physical copies of necessary documents.

However, this solution:

* Does not meet end users where they are in their personal digital transformation journey.
    * End users are likely already using storage services such as Google Drive and Dropbox.
      Advanced users may be using object stores, such as Amazon Web Services S3.
      Requiring users to put documents in yet another storage service is a risk to adoption.
* Relies on the Solid ecosystem, which is dependent on a number of web specifications that are not yet stable.
* Will require the PASS development team to build a reliable storage service to meet stakeholder availability expectations.
    * If not the PASS development team, then some government organization.
    * If not some government organization, then some privately funded company.

This proposal redefines the problem to be:

* Users have access to many high-quality, free storage services, but they do not have a way to organize and recall where their necessary files are located across their digital storage accounts.

The solution outlined in this document, referred to as Document Lookup, applies the concept of an address book to digital documents.
Digital documents are stored in a variety of safe and secure third-party storage services.
As users obtain more digital accounts and migrate to different mobile platforms, their preferred or default storage service changes.
A consequence of this is that digital documents are spread across multiple storage services.
Document Lookup's objective is to help users map a document type (e.g., drivers license, birth certificate) to its digital document.

## Tenets

The follow are the tents of the design proposed in this document:

* Meet users where they are to provide a trustworthy, intuitive solution.

## Context and Scope

### Part 1: The needle in the stack of needles

Many people in crisis already own an Android or Apple device, giving them access to *free, reliable, and secure* cloud storage.
These devices are often equipped with a camera and support automatic backing up of files (e.g., photos, documents) to the cloud.
For example, Android devices allow you to log into your Google account to seamlessly and automatically back up the photos you take to Google Drive.
Here we identity the first part of our scope:

> Storing digital files in cloud storage providers has never been easier,
> as it is often an asynchronous background task on devices and the user is rarely required to be in the loop.
> Remembering what files and where they are in the cloud, however, is a challenge.

Some cloud storage providers provide users with a searchbox to enable users to search for documents.
This can work well in some cases, but it under performs for photos.
For example, it was not uncommon to see people endlessly scrolling through their cloud storage accounts trying to find the picture they took of their COVID-19 vaccination card.

### Part 2: Users use multiple cloud storage providers

The benefit of cloud storage providers is that they are tied to a personal account, not a specific device.
These personal accounts, however, are specific to the cloud storage provider (e.g., Google accounts are tied to, you guessed it, Google Drive).
When a person switches from one device vendor to another (e.g., from Android to Apple), digital documents become dispersed across multiple accounts and, therefore, multiple cloud storage providers.
This brings us to the second part of our scope:

> Users have digital documents across cloud storage providers.
> They need a Rolodex to remember where their files, especially the important ones, are stored.

We are very used to the idea of adding a friend's information into our cloud-backed contacts applications.
Since no one bothers with remembering the layout of the city they live in anymore,
we simply open our contacts application on our phones,
type our friend's name,
and click their address to open our phone's map navigation application.
This is the type of workflow we are used to -- it's simple and intuitive.

The system proposed in this document is the "digital file locator" analog for the contacts application that geo-locates a friend's house.
"I know I took a picture of my COVID-19 vaccination card, but I can't remember if it was on my Google Pixel or my iPhone!"
With the proposed system, this frustration will be a thing of the past.

* Record the location (URL) and cloud storage service provider

The following user stories capture the high-level requirements:

* As an individual, I want to add a new file to _\<storage service\>_ through Document Lookup.
* As an individual, I want to add a file to Document Lookup that already exists in my _\<storage service\>_ account.
* As an organization, I want to indicate to an individual whether she has the necessary documents in their Document Lookup for one of my services.
* As an individual, I want to quickly send a copy of one or more files that are dispersed across one or more cloud storage services over email.

Supported storage services shall be:

* Google Drive
* Apple iCloud

## Architecture

TODO

## Appendix A: User Story Sequences

### User Story: Store New File via Document Lookup to Google Drive

As a user, I want to upload an important local file to my Google Drive account through Document Lookup.

```mermaid
sequenceDiagram
    participant Alice as Individual
    participant PFE as PASS Front End
    participant PBE as PASS Back End
    participant GDrive as Google Drive
    %participant OneDrive as Microsoft OneDrive

    Alice->>+PFE: PASS log in & consent
    PFE->>+PBE: Check credentials
    PBE-->>-PFE: 
    PFE-->>-Alice: Login successful

    Alice->>+PFE: Select to upload DRIVER LICENSE
    PFE->>+PBE: Fetch DRIVER LICENSE form
    PBE-->>-PFE: 
    PFE-->>-Alice: Display DRIVER LICENSE metadata form
    Alice->>+Alice: Complete DRIVER LICENSE metadata form
    Alice->>Alice: Attach DRIVER LICENSE document from local storage
    Alice->>Alice: Select Google Drive account for storage
    Alice->>-PFE: 

    % Authenticate Alice to Google Drive
    PFE->>+GDrive: Request token
    Alice->>GDrive: Google log in & consent
    GDrive-->>-PFE: Authorization code
    PFE->>+GDrive: Exchange code for token
    GDrive-->>-PFE: Token response

    Alice->>+PFE: Submits metadata form
    PFE->>+PBE: Validate form
    PBE-->>-PFE: 
    PFE-->>-Alice: Confirm form is valid
    Alice->>+PFE: Uploads file via Google Drive UI widget
    PFE->>GDrive: 
    GDrive-->>PFE: 
    PFE-->>-Alice: File is now stored in Google Drive account
    Alice->>+PBE: Inform storage of file was successful
    PBE->>PBE: Updated user-document-metadata database
    PBE-->>-Alice: Done!
```