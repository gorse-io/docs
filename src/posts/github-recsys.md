---
date: 2026-01-01
category:
  - Case Study
tag:
  - Case Study
---

# Building a Recommender System for GitHub Repositories

Unlike common frontend, backend, and AI open-source projects, it is difficult for potential users to directly perceive the utility of an open-source recommender system. Therefore, authors of Gorse built [GitRec](https://gitrec.gorse.io), a recommender system for GitHub repositories. This project not only demonstrates the basic capabilities of Gorse but also helps users discover interesting and useful repositories among the massive amount of open-source projects.

<iframe src="https://gitrec.gorse.io" style="width:100%; height:600px; border:none;"></iframe>

::: note
GitRec has been running for three years, but it underwent a comprehensive upgrade and refactoring for Gorse v0.5 in 2025. The content in this article is based on the latest version of GitRec. New features in version v0.5 are marked with <u>underline</u> in this article.
:::

## Data Collection

You can't make bricks without straw. The first step in building a recommender system is to construct the dataset consists of items, users, and feedback.

### Items: GitHub Repositories

- `ItemId`: To facilitate URL concatenation, `/` in the repository name is replaced with `:` and unified to lowercase.
- `Categories`: The main programming language of the repository, can be used to filter recommendation results.
- `Timestamp`: The last update time of the repository.
- `Labels` <u>is a JSON composed of two fields</u>:
  - **Topics**: Topics added by the repository administrator.
  - **Text Embedding of Description**: A highlight of GitRec is that it uses OpenAI's `text-embedding-v3` model to generate a 512-dimensional embedding vector for the description of each repository. If a repository has no description, GitRec uses the `gpt-5-nano` to read its `README.md` file and generate a single-sentence summary before embedding.

The following is the item record of the [Gorse](https://github.com/gorse-io/gorse) repository in Gorse. The `Comment` field uses the repository description as a remark for easy viewing in the dashboard.

```json
{
  "ItemId": "gorse-io:gorse",
  "IsHidden": false,
  "Categories": [
    "go"
  ],
  "Timestamp": "2025-05-24T19:41:09Z",
  "Labels": {
    "embedding": [-0.0913363918662071, -0.0101912319660187, -0.0689065530896187, 0.0137317562475801, ...],
    "topics": ["recommender-system", "collaborative-filtering", "go", "knn", "machine-learning"]
  },
  "Comment": "Gorse open source recommender system engine"
}
```

Due to the huge number of repositories on GitHub, GitRec only collects repositories with more than 100 stars to balance cost and coverage. Repositories are mainly collected in two ways:

1. Crawl repositories on GitHub trending every day.
2. When accepting user feedback, add the repositories involved in user feedback to the item database.

### Users: Giving up Personal Information

After comprehensive consideration, GitRec chose not to collect any personal information of users other than User ID and feedback, for the following reasons:
1. The personal information of GitHub users is very diverse. Except for a small amount of structured data such as company and location, users can also provide information in unstructured text such as personal biography and README files. At the same time, many users fill in very little information or even none, making recommendation based on personal information difficult.
2. In the current era of emphasis on privacy protection, choosing not to collect personal information is a good choice.

In Gorse, the `UserId` of a user record corresponds to the GitHub User ID, while other fields are empty. Whenever a new user signs into GitRec, the system automatically creates a user record.

```json
{
  "UserId": "zhenghaoz",
  "Labels": [],
  "Comment": ""
}
```

### Feedback: Like and Read

Through the GitHub API, we can actually only get the user's `star` behavior on the repository, but cannot get the "read" behavior. Therefore, GitRec provides a browser extension that can collect records of users browsing repositories. Finally, the definition of feedback in GitRec is as follows:

**Positive Feedback**:
- `star`: The user stars a repository on GitHub.
- `like`: The user clicks ::likefill:: on a repository on the GitRec website.
- `read>=3`: The user views a repository at least 3 times.

**Read Feedback**:
- `read`: The user views a repository.

The `read` feedback is collected by the browser extension, the `like` feedback is collected by the GitRec website, and the `star` feedback is synchronized via the GitHub API once a day. <u>The `read` count accumulates each time a user visits the repository. When the count reaches 3, the system converts it into positive feedback.</u>

## Recommendation Pipeline Configuration

The detailed configuration of the GitRec recommendation pipeline can be found in the [config.toml](https://github.com/gorse-io/gitrec/blob/master/config.toml) file of the repository. The main content is:

- Non-personalized recommender `most_starred_weekly`: <u>The score is calculated by a custom formula</u>, recommending the repositories with the most stars this week.
- Item-to-item recommender `neighbors`: <u>Recommend similar items based on the embedding of the repository description</u>.
- User-to-item recommender `neighbors`: Recommend items liked by users with high overlap in starred repositories.
- Collaborative filtering recommender keeps the default configuration.

The ranker merges the above recommendation results and the latest items, then uses the trained factorization machine for final ranking. If the generated recommendation results are insufficient, item-to-item recommendations and latest items are used to fill in sequentially.

## User Interface and Interaction

GitRec provides services to users in two ways.

### Website

The website provides an immersive repository discovery experience modeled after TikTok:

- **Explore**: This is the core function of the website, displaying the `README` content of the repository in full screen. You can choose:
  - Click the ::likefill:: button, this behavior will be recorded as a positive feedback.
  - Click the ::start:: button, the system will mark the current repository as "read" and present the next recommendation for you.
  - You can select the programming language at the top of the page to filter the recommendation results.
- **Favorites**: This contains all the repositories you have starred on GitHub or liked on the GitRec website.

### Browser Extension

The browser extension seamlessly integrates recommendations into GitHub pages:

- **"Explore repositories" on GitHub homepage**: On the GitHub homepage, the extension injects an "Explore repositories" module to provide personalized repository recommendations. Even without logging into GitRec, the extension can provide preliminary personalized recommendations based on recently starred repository.
- **"Related repositories" on repository page**: When browsing any GitHub repository with more than 100 stars, the extension adds a "Related repositories" column on the right side of the page. This will display several repositories most similar to the current repository.
- **Read feedback collection**: The extension records the repositories browsed and sends this read feedback to the GitRec server, collecting no other personal information.

## Scale and Cost

By the end of 2025, GitRec's data scale is as follows:
- More than 240,000 GitHub repositories
- More than 3,000 registered users
- More than 300,000 user feedback records

The Gorse recommender system and database are deployed on a cloud server with 2 CPU cores and 8GB RAM, costing 50 USD/month.

## Summary

GitRec is not only a GitHub repository recommender system, but also a testing ground for the Gorse recommender system. Welcome to use the GitRec [website](https://gitrec.gorse.io) or install the browser extension (supports [Chrome](https://chromewebstore.google.com/detail/gitrec/eihokbaeiebdenibjophfipedicippfl), [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/gitrec/) and [Edge](https://microsoftedge.microsoft.com/addons/detail/gitrec/cpcfbfpnagiffgpmfljmcdokmfjffdpa)) to help the continuous development of the Gorse recommender system.
