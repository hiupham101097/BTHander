import React, { useEffect, useState } from "react";
import { ArrowLeft, Code2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/projects/${id}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Không tìm thấy dự án");
        return response.json();
      })
      .then((body) => { setProject(body.data); setState("ready"); })
      .catch((error) => { if (error.name !== "AbortError") setState("error"); });
    return () => controller.abort();
  }, [id]);

  if (state === "loading") return <main className="project-detail-page wrap"><p className="api-state">Đang tải dự án...</p></main>;
  if (state === "error") return <main className="project-detail-page wrap"><Link to="/#projects"><ArrowLeft size={17} /> Quay lại</Link><p className="api-state api-state-error">Không tìm thấy dự án.</p></main>;

  return <main className="project-detail-page wrap">
    <Link className="project-detail-back" to="/#projects"><ArrowLeft size={17} /> Quay lại danh sách</Link>
    <header className="project-detail-header">
      <h1>{project.name}</h1>
      <div className="project-languages"><Code2 size={16} /> {project.languages.join(" · ")}</div>
      {project.description && <p>{project.description}</p>}
    </header>
    {project.images?.length > 0 ? <div className="project-gallery">
      {project.images.map((photo) => <button type="button" key={photo.id} className="project-gallery-item" onClick={() => window.open(photo.url, "_blank", "noopener,noreferrer")}>
        <img src={photo.url} alt={`${project.name} - ${photo.file_name}`} loading="lazy" />
      </button>)}
    </div> : <p className="api-state">Dự án chưa có hình ảnh.</p>}
    <section className="project-detail-config"><h2>Thông tin dự án</h2><dl className="project-config">
      {Object.entries(project.configuration || {}).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}
    </dl></section>
  </main>;
}
