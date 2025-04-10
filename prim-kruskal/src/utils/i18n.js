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
    weight_matrix: "Weight Matrix",
    search_process: "Search Process"
  }
};

export function useI18n() {
  const t = (key) => {
    return translations.en[key] || key;
  };

  return { t };
}
