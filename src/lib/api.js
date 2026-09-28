const baseUrl = import.meta.env?.VITE_API_BASE_URL || "";

// One timeout/error contract for public reads and user actions. Never retry writes.
export async function apiRequest(path, { timeout = 15000, signal, ...options } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => controller.abort(new DOMException("Request timed out", "TimeoutError")), timeout);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      credentials: "include",
      ...options,
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.errors?.[0] || body?.error || "Không thể thực hiện yêu cầu. Vui lòng thử lại.");
      error.status = response.status;
      throw error;
    }
    if (body === null) throw new Error("Phản hồi không hợp lệ. Vui lòng thử lại.");
    return body;
  } catch (error) {
    if (!signal?.aborted && controller.signal.aborted) {
      throw new Error("Kết nối quá chậm. Vui lòng kiểm tra mạng và thử lại.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
