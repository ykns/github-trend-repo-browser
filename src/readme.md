# GitHub Trend browser

## Setup
1. create `.env` with following `VITE_GITHUB_PAT` set your GitHub PAT with `public_repo` permissions: 
```.env
VITE_GITHUB_PAT=ghp_...
```
While GitHub has publicly accessibly API it's heavily rate limited and thus the client can frequently get 403s.

## Dev
1. yarn
2. yarn dev, which starts serving on http://127.0.0.1:5173/
Note: When done press `q` to kill server