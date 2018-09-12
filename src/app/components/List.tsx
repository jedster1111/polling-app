import * as React from "react";
import { connect } from "react-redux";
import { Option, Poll } from "../../../server/models/database";
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
  polls: Poll[];
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
        polls.map((poll: Poll) => (
          <li key={poll.pollId}>
            <div>CreatorName: {poll.creatorName}</div>
            <div>Poll name: {poll.pollName}</div>
            <div>description: {poll.description}</div>
            <div>
              options:{" "}
              {poll.options.map((option: Option) => (
                <div key={option.optionId}>{option.value}</div>
              ))}
            </div>
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
