[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&env=GITHUB_WEBHOOK_SECRET,GITHUB_APP_ID,GITHUB_APP_PK_PEM&envDescription=API%20keys%20needed%20to%20connect%20to%20the%20GitHub%20Application.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&demo-title=On-Demand%20ISR&demo-description=Demo%20of%20on-demand%20ISR%20in%20Next.js%2012.1%20using%20GitHub%20Issues.&demo-url=https%3A%2F%2Fon-demand-isr.vercel.app)

# On-Demand Incremental Static Regeneration
1. start with a static list of users
1. extract the the resp from all selected users as react queries.
1. for each user return new query to get the repo summary that returns the element.
1. Query repos from users in list, allow user to enter and select own user name.
1. Create a drop down that is prepopulated with repos to select from.
1. read the source code and artifacts from the repo.
1. allow for evaluation and rendering of the data from the repo based on rules in the repo/artifact itself using caution and security minded evaluation.
1. get up and running quickly, and then get it to run quickly next.

## TODOS
1. improve performance
1. for each repo fetch its details as a new query.
1. add hyper links to user pages and repo pages for all repos
1. add the default users to an multi select list of user.
1. select the max amount of repos default to 50.

1. precompile data and write it on server in cache directory, save to git if you want.
1. write react quest cache to disk as json blob in some directory structure based on keys
1.1. create an ordering of the keys, a hierarchy
https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister

## Setup

For vercel deployment, add the environmental variables to your server secret settings,
`https://vercel.com/<username>/<project>/settings/environment-variables`,
For local deploy add the variables to `.env.local`, do not check them in.

1. Create a new [GitHub App](https://github.com/settings/apps/new)
   1. Provide the URL of your deployed application for Homepage URL
   1. Ensure Webhook "Active" is checked
   1. Add `<your-site>/api/webhook` as the Webhook URL
   1. Create a Webhook secret and add it to `.env.local` as `GITHUB_WEBHOOK_SECRET`
   1. Give "Read Only" access to Issues
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

## Learn More

- [Read the documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)

## Steps

```
  pnpm install -D tailwindcss postcss autoprefixer  --force
  pnpm dlx tailwindcss init -p
  ```
  
  Now add the components used by claude.ai its code.
  ```
  pnpm dlx shadcn@latest add card 
  pnpm dlx shadcn@latest add button
  pnpm dlx shadcn@latest add badge
```
