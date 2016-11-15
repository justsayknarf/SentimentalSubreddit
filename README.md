# SentimentalSubreddit
Node project examining the sentiment of reddit comments in specific subreddits

## How to use ##
At the moment, this is just a script that does the following: 
Using the subreddit specified, pulls the top 20 posts of the last week,
Extracts only the comment text (minus usernames, links, headers, etc.)
Calls AlchemyAPI to analyze sentiment and emotion of each post.
Displays results.

## Under development ##
Eventually, this will be a webapp that monitors ongoing sentiment and emotions for subreddits over time, using node in the backend to update stored subreddit sentiment daily. 

Continuing to explore other Sentiment Analysis APIs and trying to understand basic NLP concepts to see if there are benefits of combining the multiple analyses. 

In the process of exploring other data analysis framework to familiarize myself with data visualization (D3).

Webapp built using HTML/CSS/Angular in the frontend, Node/Mongo in the back. 

