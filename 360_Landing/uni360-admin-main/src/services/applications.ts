import applications from "../../../../mock-data/applications.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getApplications = async (filters) => {
  await delay(300);
  let result = [...applications];
  if (filters?.status) result = result.filter((a) => a.status === filters.status);
  if (filters?.workflowStage) result = result.filter((a) => a.workflowStage === filters.workflowStage);
  if (filters?.countryCode) {
    const countryMap = { DE: "Germany", UK: "UK" };
    result = result.filter((a) => a.country === (countryMap[filters.countryCode] || filters.countryCode));
  }
  if (filters?.isUrgent !== undefined) result = result.filter((a) => a.isUrgent === filters.isUrgent);
  return {
    success: true,
    data: result,
    totalPages: 1,
    totalElements: result.length,
    pagination: { total: result.length, size: 20, totalPages: 1, page: 0, hasPrevious: false, hasNext: false },
    stageSummary: {
      total: result.length,
      claimPending: result.filter((a) => a.status === "CLAIM_PENDING").length,
      underReview: result.filter((a) => a.status === "UNDER_REVIEW").length,
      completed: result.filter((a) => a.status === "COMPLETED").length,
    },
  };
};

export const getApplicationById = async (applicationId) => {
  await delay(200);
  const app = applications.find((a) => a.id === Number(applicationId));
  if (app) return { success: true, data: [app] };
  return { success: false, message: "Application not found" };
};

export const updateApplication = async (applicationId, updates) => {
  await delay(300);
  return { success: true, data: [{ id: applicationId, ...updates }], message: "Application updated successfully" };
};

export const createDemoApplication = async () => {
  await delay(200);
  const nextId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
  const demoApp = {
    id: nextId,
    studentId: 999,
    studentName: "Demo Student " + nextId,
    universityId: 2,
    universityName: "Ludwig Maximilian University of Munich",
    courseId: 2,
    courseName: "M.Sc. Data Science",
    country: "Germany",
    status: "CLAIM_PENDING",
    workflowStage: "CLAIM_PENDING",
    assignedAdminId: 3,
    assignedAdminName: "Sarah Wilson",
    appliedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    targetSemester: "Winter 2026",
    isUrgent: true,
    progress: 10,
    documents: [
      { id: 1, name: "Transcript", status: "PENDING" },
      { id: 2, name: "SOP", status: "PENDING" },
      { id: 3, name: "Passport", status: "PENDING" }
    ],
    notes: "Demo application generated in DEMO_MODE."
  };
  applications.unshift(demoApp);
  return { success: true, data: demoApp };
};

