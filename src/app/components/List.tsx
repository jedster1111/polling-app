import * as React from "react";
import { connect } from "react-redux";
import { PollInput } from "../../../server/models/database";
import { Article, InitialState } from "../reducers/reducers";

const mapStateToProps = (state: InitialState) => ({
  articles: state.articles.articles,
  polls: state.polls.polls
});

const ConnectedList = ({
  articles,
  polls
}: {
  articles: Article[];
  polls: PollInput[];
}) => (
  <div>
    <h3>Articles</h3>
    <ul>
      {articles.length ? (
        articles.map((article: Article) => (
          <li key={article.id}>{article.title}</li>
        ))
      ) : (
        <h1>No articles yet</h1>
      )}
    </ul>
    <h3>Polls</h3>
    <ul>
      {polls.length ? (
        polls.map((poll: PollInput, index) => (
          <li key={index}>
            {poll.creatorName}, {poll.pollName}, {poll.description}
          </li>
        ))
      ) : (
        <h1>No polls yet</h1>
      )}
    </ul>
  </div>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;
