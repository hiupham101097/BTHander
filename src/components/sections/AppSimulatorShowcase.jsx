import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  QrCode,
  Power,
  Activity,
  Cpu,
  Sliders,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Wifi,
  BatteryMedium,
  Check,
  FileCode2,
  ExternalLink
} from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function AppSimulatorShowcase() {
  // Simulator state
  const [activeTab, setActiveTab] = useState("control"); // control, tools, logs
  const [powerMain, setPowerMain] = useState(true);
  const [sensorActive, setSensorActive] = useState(true);
  const [powerOutput, setPowerOutput] = useState(78);
  const [syncStatus, setSyncStatus] = useState("Đồng bộ");
  const [logs, setLogs] = useState([
    { id: 1, time: "10:04:12", text: "Khởi tạo hệ thống thành công", type: "success" },
    { id: 2, time: "10:05:01", text: "Kết nối module điều khiển: OK", type: "info" },
    { id: 3, time: "10:05:30", text: "Cảm biến telemetry đang truyền tải", type: "info" },
  ]);
  const [toast, setToast] = useState(null);

  // Current phone time
  const [timeStr, setTimeStr] = useState("10:05");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSync = () => {
    setSyncStatus("Đang đồng bộ...");
    setTimeout(() => {
      setSyncStatus("Đã đồng bộ");
      setLogs((prev) => [
        { id: Date.now(), time: timeStr + ":15", text: "Đã đồng bộ dữ liệu với máy chủ", type: "success" },
        ...prev.slice(0, 4),
      ]);
      triggerToast("Dữ liệu đã được đồng bộ!");
    }, 700);
  };

  const handleAddLog = () => {
    setLogs((prev) => [
      { id: Date.now(), time: timeStr + ":45", text: `Thử nghiệm lệnh xung nhịp [${Math.floor(Math.random() * 900 + 100)}Hz]`, type: "info" },
      ...prev.slice(0, 4),
    ]);
    triggerToast("Đã kích hoạt lệnh thử nghiệm!");
  };

  return (
    <section className="section app-simulator-section" id="app-demo">
      <div className="wrap">
        <div className="simulator-header">
          <Reveal>
            <div className="simulator-badge">
              <Sparkles size={14} /> Trải nghiệm trực quan
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="section-title">
              Trải nghiệm ứng dụng ngay trên web. <br />
              Sẵn sàng cài đặt file APK.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="section-sub">
              Bấm trực tiếp vào màn hình điện thoại bên dưới để thử nghiệm giao diện và luồng điều khiển trước khi tải bản cài đặt Android chính thức.
            </p>
          </Reveal>
        </div>

        <div className="simulator-layout">
          {/* LEFT: Phone Simulator */}
          <Reveal delay={120}>
            <div className="phone-wrapper">
              <div className="phone-ambient-glow" />
              
              <div className="phone-device">
                {/* Hardware details */}
                <div className="phone-notch">
                  <div className="phone-speaker" />
                  <div className="phone-camera" />
                </div>

                {/* In-app Status bar */}
                <div className="phone-status-bar">
                  <span className="phone-time">{timeStr}</span>
                  <div className="phone-status-icons">
                    <Wifi size={13} />
                    <span className="phone-net-type">5G</span>
                    <BatteryMedium size={15} />
                  </div>
                </div>

                {/* App Screen Content */}
                <div className="phone-screen-content">
                  {/* App Header */}
                  <div className="phone-app-bar">
                    <div className="phone-app-brand">
                      <div className="brand-dot" />
                      <div>
                        <h4>BThander Hub</h4>
                        <span className="brand-sub">Sẵn sàng vận hành</span>
                      </div>
                    </div>
                    <button
                      className="phone-sync-btn"
                      onClick={handleSync}
                      title="Đồng bộ dữ liệu"
                    >
                      <RefreshCw size={13} className={syncStatus.includes("Đang") ? "spin" : ""} />
                    </button>
                  </div>

                  {/* Toast notification inside screen */}
                  {toast && (
                    <div className="phone-toast">
                      <CheckCircle2 size={13} />
                      <span>{toast}</span>
                    </div>
                  )}

                  {/* SCREEN 1: CONTROL */}
                  {activeTab === "control" && (
                    <div className="phone-tab-pane animate-fade-in">
                      <div className="mini-stat-card">
                        <div className="stat-card-row">
                          <span className="stat-label">Trạng thái hệ thống</span>
                          <span className={`status-pill ${powerMain ? "status-on" : "status-off"}`}>
                            {powerMain ? "HOẠT ĐỘNG" : "TẠM DỪNG"}
                          </span>
                        </div>
                        <div className="stat-main-val">
                          {powerMain ? `${(powerOutput * 12.5).toFixed(0)} RPM` : "0 RPM"}
                        </div>
                        <div className="stat-metric-bar">
                          <div
                            className="metric-fill"
                            style={{ width: powerMain ? `${powerOutput}%` : "0%" }}
                          />
                        </div>
                      </div>

                      <div className="interactive-toggles">
                        <div className="toggle-row">
                          <div className="toggle-info">
                            <Power size={16} className={powerMain ? "icon-active" : ""} />
                            <div>
                              <strong>Nguồn thiết bị</strong>
                              <small>{powerMain ? "Đang cấp điện" : "Đã ngắt nguồn"}</small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`switch-btn ${powerMain ? "active" : ""}`}
                            onClick={() => {
                              setPowerMain(!powerMain);
                              triggerToast(powerMain ? "Đã tắt nguồn" : "Đã bật nguồn");
                            }}
                          >
                            <span className="switch-thumb" />
                          </button>
                        </div>

                        <div className="toggle-row">
                          <div className="toggle-info">
                            <Activity size={16} className={sensorActive ? "icon-active" : ""} />
                            <div>
                              <strong>Cảm biến IoT</strong>
                              <small>{sensorActive ? "Tần số 100Hz" : "Chế độ ngủ"}</small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`switch-btn ${sensorActive ? "active" : ""}`}
                            onClick={() => {
                              setSensorActive(!sensorActive);
                              triggerToast(sensorActive ? "Đã tắt cảm biến" : "Cảm biến đã kích hoạt");
                            }}
                          >
                            <span className="switch-thumb" />
                          </button>
                        </div>
                      </div>

                      <div className="slider-box">
                        <div className="slider-label-row">
                          <span><Sliders size={13} /> Công suất tải</span>
                          <strong>{powerOutput}%</strong>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={powerOutput}
                          disabled={!powerMain}
                          onChange={(e) => setPowerOutput(Number(e.target.value))}
                          className="mini-range-input"
                        />
                        <div className="slider-sub-info">
                          <span>Điện áp: {(powerOutput * 0.24 + 12).toFixed(1)}V</span>
                          <span>Nhiệt độ: {(35 + powerOutput * 0.15).toFixed(1)}°C</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: TOOLS / ESTIMATE */}
                  {activeTab === "tools" && (
                    <div className="phone-tab-pane animate-fade-in">
                      <div className="tools-title">
                        <span>Tiện ích nhanh</span>
                        <small>Kiểm tra lệnh</small>
                      </div>

                      <div className="quick-action-grid">
                        <button
                          className="quick-action-card"
                          onClick={handleAddLog}
                        >
                          <Cpu size={20} />
                          <span>Gửi lệnh Test</span>
                        </button>
                        <button
                          className="quick-action-card"
                          onClick={() => {
                            setPowerOutput(50);
                            triggerToast("Đã cân bằng tải về 50%");
                          }}
                        >
                          <Sliders size={20} />
                          <span>Cân bằng tải</span>
                        </button>
                      </div>

                      <div className="mini-info-box">
                        <ShieldCheck size={16} />
                        <div>
                          <strong>Giao thức bảo vệ</strong>
                          <p>Hệ thống tự động ngắt nếu tải vượt ngưỡng 95% trong 30 giây.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: LOGS */}
                  {activeTab === "logs" && (
                    <div className="phone-tab-pane animate-fade-in">
                      <div className="logs-header">
                        <span>Nhật ký thời gian thực</span>
                        <button className="text-btn" onClick={() => setLogs([])}>Xoá</button>
                      </div>
                      <div className="phone-log-list">
                        {logs.length === 0 ? (
                          <div className="log-empty">Chưa có bản ghi mới.</div>
                        ) : (
                          logs.map((item) => (
                            <div key={item.id} className={`log-item log-${item.type}`}>
                              <span className="log-time">{item.time}</span>
                              <span className="log-text">{item.text}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="phone-nav-bar">
                  <button
                    className={`phone-nav-item ${activeTab === "control" ? "active" : ""}`}
                    onClick={() => setActiveTab("control")}
                  >
                    <Power size={17} />
                    <span>Điều khiển</span>
                  </button>
                  <button
                    className={`phone-nav-item ${activeTab === "tools" ? "active" : ""}`}
                    onClick={() => setActiveTab("tools")}
                  >
                    <Cpu size={17} />
                    <span>Tiện ích</span>
                  </button>
                  <button
                    className={`phone-nav-item ${activeTab === "logs" ? "active" : ""}`}
                    onClick={() => setActiveTab("logs")}
                  >
                    <Activity size={17} />
                    <span>Nhật ký</span>
                  </button>
                </div>
              </div>
              
              <div className="phone-hint">
                <Sparkles size={13} /> Chạm hoặc click các nút để tương tác trực tiếp
              </div>
            </div>
          </Reveal>

          {/* RIGHT: APK Download & QR Scan Box */}
          <div className="apk-details-col">
            <Reveal delay={150}>
              <div className="apk-card">
                <div className="apk-header">
                  <div className="apk-badge-tag">
                    <Smartphone size={14} /> Android App (.apk)
                  </div>
                  <span className="apk-version">v1.2.0 • Sẵn sàng cài đặt</span>
                </div>

                <h3 className="apk-title">BThander Mobile Hub</h3>
                <p className="apk-description">
                  Ứng dụng di động chuyên dụng phục vụ theo dõi thiết bị, quản lý số liệu và kết nối thời gian thực. Được tối ưu hóa cho hiệu năng cao, nhẹ nhàng và bảo mật.
                </p>

                <div className="apk-specs-grid">
                  <div className="spec-item">
                    <small>Định dạng</small>
                    <strong>File .APK</strong>
                  </div>
                  <div className="spec-item">
                    <small>Dung lượng</small>
                    <strong>~18.5 MB</strong>
                  </div>
                  <div className="spec-item">
                    <small>Yêu cầu</small>
                    <strong>Android 8.0+</strong>
                  </div>
                  <div className="spec-item">
                    <small>Kiểm duyệt</small>
                    <strong className="text-safe"><Check size={14} /> An toàn 100%</strong>
                  </div>
                </div>

                {/* Direct Download Button */}
                <div className="apk-cta-actions">
                  <a
                    href="/downloads/bthander-hub-v1.2.0.apk"
                    download
                    className="apk-download-btn"
                  >
                    <Download size={18} />
                    <span>
                      <strong>Tải file APK trực tiếp</strong>
                      <small>Phiên bản v1.2.0 (18.5 MB)</small>
                    </span>
                    <ArrowRight size={17} className="arrow-icon" />
                  </a>
                </div>

                {/* QR Code Section */}
                <div className="apk-qr-box">
                  <div className="qr-preview">
                    {/* Visual Crisp SVG QR code representation */}
                    <svg viewBox="0 0 100 100" className="qr-svg-graphic" aria-label="Mã QR tải ứng dụng">
                      {/* Background */}
                      <rect width="100" height="100" fill="#ffffff" rx="8" />
                      {/* Top-Left Finder */}
                      <rect x="10" y="10" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="15" y="15" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="19" y="19" width="10" height="10" fill="#0f172a" rx="1" />
                      {/* Top-Right Finder */}
                      <rect x="62" y="10" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="67" y="15" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="71" y="19" width="10" height="10" fill="#0f172a" rx="1" />
                      {/* Bottom-Left Finder */}
                      <rect x="10" y="62" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="15" y="67" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="19" y="71" width="10" height="10" fill="#0f172a" rx="1" />
                      {/* Data Pattern Modules */}
                      <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                      <rect x="50" y="12" width="6" height="6" fill="#0f172a" />
                      <rect x="42" y="24" width="6" height="6" fill="#0f172a" />
                      <rect x="50" y="28" width="6" height="6" fill="#0f172a" />
                      <rect x="12" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="24" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="42" y="42" width="14" height="14" fill="#0f172a" rx="2" />
                      <rect x="62" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="78" y="44" width="8" height="6" fill="#0f172a" />
                      <rect x="44" y="64" width="8" height="6" fill="#0f172a" />
                      <rect x="54" y="72" width="6" height="8" fill="#0f172a" />
                      <rect x="66" y="62" width="10" height="6" fill="#0f172a" />
                      <rect x="80" y="68" width="8" height="8" fill="#0f172a" />
                      <rect x="68" y="78" width="8" height="10" fill="#0f172a" />
                      <rect x="80" y="82" width="8" height="6" fill="#0f172a" />
                      <rect x="44" y="80" width="8" height="8" fill="#0f172a" />
                    </svg>
                    <div className="qr-brand-overlay">
                      <Smartphone size={15} />
                    </div>
                  </div>
                  <div className="qr-info">
                    <div className="qr-info-title">
                      <QrCode size={16} /> Quét mã bằng camera điện thoại
                    </div>
                    <p>
                      Mở máy ảnh trên smartphone Android và quét mã để tải nhanh file APK mà không cần truyền cáp dữ liệu.
                    </p>
                  </div>
                </div>

                {/* 3-Step Install Guide */}
                <div className="install-steps">
                  <span className="steps-heading">Hướng dẫn cài đặt nhanh 3 bước:</span>
                  <div className="steps-list">
                    <div className="step-row">
                      <div className="step-num">1</div>
                      <div className="step-desc">
                        <strong>Tải file APK</strong> từ nút trên hoặc quét mã QR.
                      </div>
                    </div>
                    <div className="step-row">
                      <div className="step-num">2</div>
                      <div className="step-desc">
                        Nhấn mở file và chọn <strong>"Cho phép cài đặt từ nguồn này"</strong> nếu có thông báo.
                      </div>
                    </div>
                    <div className="step-row">
                      <div className="step-num">3</div>
                      <div className="step-desc">
                        Bấm <strong>Cài đặt</strong> và bắt đầu trải nghiệm toàn bộ tính năng!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
