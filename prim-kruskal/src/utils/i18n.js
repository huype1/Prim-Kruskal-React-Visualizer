const translations = {
  en: {
    round: "Round",
    weight: "Weight",
    submit: "Submit",
    select_start: "Select start node:",
    find_path: "Find shortest path",
    next_step: "Next step",
    auto_play: "Auto play",
    pause: "Pause",
    weight_list: "Weight List",
    search_process: "Search Process"
  },
  vn: {
    round: "Round",
    weight: "Weight",
    submit: "Submit",
    select_start: "Chọn đỉnh bắt đầu:",
    find_mst: "Bắt đầu",
    next_step: "Buớc tiếp theo",
    auto_play: "Tự động",
    pause: "Dừng",
    weight_list: "Thuật toán tìm cây khung nhỏ nhất",
    search_process: "Search Process",
    input: "Custom Graph Input",
    num_nodes_label: "Số Đỉnh:",
    add_graph: "Thêm đồ thị",
    default_graph: "Đồ thị gốc",
    select_algorithm: "Chọn thuật toán",
  }
};

export function useI18n() {
  const t = (key) => {
    return translations.vn[key] || key;
  };

  return { t };
}
