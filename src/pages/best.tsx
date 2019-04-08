import * as React from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-server-express';

import { MainLayout } from '../layouts/main-layout';
import { NewsFeedView } from '../components/news-feed';
import { NewsFeed } from '../components/news-feed';
import { withData } from '../helpers/with-data';
import { FeedType } from '../data/models/feed';

const POSTS_PER_PAGE = 30;

const query = gql`
  query bestNewsItems($type: FeedType!, $first: Int!, $skip: Int!) {
    feed(type: $type, first: $first, skip: $skip) {
      ...NewsFeed
    }
  }
  ${NewsFeedView.fragments.newsItem}
`;

export interface IBestNewsFeedProps {
  options: {
    first: number;
    skip: number;
  };
}

const BestNewsFeed = graphql<IBestNewsFeedProps>(query, {
  options: ({ options: { first, skip } }) => ({
    variables: {
      type: FeedType.BEST,
      first,
      skip,
    },
  }),
  props: ({ data }) => ({
    data,
  }),
})(NewsFeed);

export const BestPage = withData(props => {
  const pageNumber = (props.url.query && +props.url.query.p) || 0;

  return (
    <MainLayout currentUrl={props.url.pathname}>
      <BestNewsFeed
        options={{
          currentUrl: props.url.pathname,
          first: POSTS_PER_PAGE,
          skip: POSTS_PER_PAGE * pageNumber,
        }}
      />
    </MainLayout>
  );
});

export default BestPage;
