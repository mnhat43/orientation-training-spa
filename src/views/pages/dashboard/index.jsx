import React from "react";
import FileView from "@components/FileView";

const Dashboard = () => {
    const fakeFiles = [
        { url: "https://storage.cloud.google.com/dev_orient_storage_bucket/files/55_1742747389040", name: "image.png" },
        // { url: "https://www.orimi.com/pdf-test.pdf", name: "dummy.pdf" },
        // { url: "https://example.com/report.pdf", name: "report.pdf" }
    ];

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <FileView files={fakeFiles} />
        </div>
    );
};

export default Dashboard;
