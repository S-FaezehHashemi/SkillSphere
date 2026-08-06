const SIMULATED_KEY = "simulated_session";

export const sessionFlags = {
  isSimulated(): boolean {
    return sessionStorage.getItem(SIMULATED_KEY) === "1";
  },

  setSimulated(value: boolean) {
    if (value) sessionStorage.setItem(SIMULATED_KEY, "1");
    else sessionStorage.removeItem(SIMULATED_KEY);
  },
};
