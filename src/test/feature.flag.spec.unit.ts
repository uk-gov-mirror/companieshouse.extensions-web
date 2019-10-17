import activeFeature from "../feature.flag";

describe("feature flag tests", () => {

  it("should return false if variable is 'false'", () => {
    const active = activeFeature("false");
    expect(active).toBeFalsy();
  });

  it("should return false if variable is '0'", () => {
    const active = activeFeature("0");
    expect(active).toBeFalsy();
  });

  it("should return false if variable is ''", () => {
    const active = activeFeature("");
    expect(active).toBeFalsy();
  });

  it("should return false if variable is 'off'", () => {
    const active = activeFeature("off");
    expect(active).toBeFalsy();
  });

  it("should return true if variable is 'on'", () => {
    const active = activeFeature("on");
    expect(active).toBeTruthy();
  });

  it("should return true if variable is 'true'", () => {
    const active = activeFeature("true");
    expect(active).toBeTruthy();
  });

  it("should return true if variable is '1'", () => {
    const active = activeFeature("1");
    expect(active).toBeTruthy();
  });
})