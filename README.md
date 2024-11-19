[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&env=GITHUB_WEBHOOK_SECRET,GITHUB_APP_ID,GITHUB_APP_PK_PEM&envDescription=API%20keys%20needed%20to%20connect%20to%20the%20GitHub%20Application.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&demo-title=On-Demand%20ISR&demo-description=Demo%20of%20on-demand%20ISR%20in%20Next.js%2012.1%20using%20GitHub%20Issues.&demo-url=https%3A%2F%2Fon-demand-isr.vercel.app)

# On-Demand Incremental Static Regeneration and caching of github artifacts for reporting on results of performance tests.

1. Get up and running quickly, and then get it to run quickly next. This project is a work in progress.
1. We start with a static list of users, later replace with preferences, like the current logged in user.
1. Query git repository from users in list, allow user to select repository via link
1. For each repository fetch its details as a new query.
1. Download and Write artifacts disk as zip file in cache directory

## Setup

For Vercel deployment, add the environmental variables to your server secret settings,
`https://vercel.com/<username>/<project>/settings/environment-variables`,
For local deploy add the variables to `.env.local`, do not check them in.

1. Create a new [GitHub App](https://github.com/settings/apps/new)
   1. Provide the URL of your deployed application for Homepage URL
   1. Ensure Web-hook "Active" is checked
   1. Add `<your-site>/api/webhook` as the Web-hook URL
   1. Create a Web-hook secret and add it to `.env.local` as `GITHUB_WEBHOOK_SECRET`
   1. Give "Read Only" access to Issues, git repository, 
   FIXME: add in the other permissions needed.
   1. Subscribe to "Issues" events
1. Add the App ID to `.env.local` as `GITHUB_APP_ID`
1. Generate a private key and add it to `.env.local` as `GITHUB_APP_PK_PEM`
quote and replace newlines like this :
```GITHUB_APP_PK_PEM="-----BEGIN RSA PRIVATE KEY-----\nABCEF==\n-----END RSA PRIVATE KEY-----"```
1. Install the newly created GitHub App for your repo
1. `https://github.com/settings/apps/<your-app-name>/installations`


## Running Locally

```bash
$ bun dev
```
