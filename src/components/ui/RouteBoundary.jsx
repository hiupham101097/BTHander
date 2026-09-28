import React from "react";

export default class RouteBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="wrap detail-state" role="alert">
          <h1>Chưa thể mở trang</h1>
          <p>Vui lòng kiểm tra kết nối và tải lại trang.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Tải lại trang</button>
          <a className="btn-ghost" href="/">Về trang chủ</a>
        </div>
      );
    }
    return this.props.children;
  }
}
