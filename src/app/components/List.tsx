import * as React from "react";
import { connect } from "react-redux";
import { Article, InitialState } from "../reducers/reducers";

const mapStateToProps = (state: InitialState) => ({
  articles: state.articles.articles
});

const ConnectedList = ({ articles }: { articles: Article[] }) => (
  <ul>
    {articles.length ? (
      articles.map((article: Article) => (
        <li key={article.id}>{article.title}</li>
      ))
    ) : (
      <h1>No articles yet</h1>
    )}
  </ul>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;
