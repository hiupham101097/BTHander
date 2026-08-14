import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function TeamArticles() {
  const { id } = useParams();

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    loadArticles();
  }, [id]);

  async function loadArticles() {
    try {
      const response = await fetch(`/api/team/${id}/articles`);

      if (!response.ok) {
        setArticles([]);
        return;
      }

      const body = await response.json();
      setArticles(body.data || []);
    } catch (error) {
      setArticles([]);
    }
  }

  return (
    <main className="wrap articles-page">
      <Link
        to={`/team/${id}`}
        className="detail-back"
      >
        <ArrowLeft size={15} />
        Quay lại profile
      </Link>

      <p className="eyebrow">
        Góc chia sẻ kinh nghiệm
      </p>

      <h1 className="section-title">
        Những bài viết từ thành viên.
      </h1>

      <div className="article-grid">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/team/${id}/articles/${article.id}`}
            className="article-card"
          >
            <FileText size={24} />

            <h2>{article.title}</h2>

            <p>
              {article.excerpt ||
                "Khám phá bài viết chuyên môn từ thành viên."}
            </p>

            <span>Đọc bài viết →</span>
          </Link>
        ))}

        {!articles.length && (
          <p className="api-state">
            Chưa có bài viết nào.
          </p>
        )}
      </div>
    </main>
  );
}

export function TeamArticleDetail() {
  const { id, articleId } = useParams();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  async function loadArticle() {
    try {
      const response = await fetch(`/api/articles/${articleId}`);

      if (!response.ok) {
        setArticle(null);
        return;
      }

      const body = await response.json();
      setArticle(body.data);
    } catch (error) {
      setArticle(null);
    }
  }

  if (!article) {
    return (
      <div className="wrap detail-state">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <article className="wrap article-detail">
      <Link
        to={`/team/${id}/articles`}
        className="detail-back"
      >
        <ArrowLeft size={15} />
        Danh sách bài viết
      </Link>

      <p className="eyebrow">
        {article.member_name} · {article.member_title}
      </p>

      <h1>{article.title}</h1>

      <p className="article-excerpt">
        {article.excerpt}
      </p>

      <div className="article-body">
        {article.content}
      </div>
    </article>
  );
}