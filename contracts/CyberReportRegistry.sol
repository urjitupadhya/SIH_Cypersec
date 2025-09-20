// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CyberReportRegistry {
    struct Report {
        uint256 id;
        address reporter;
        string reportHash;
        string category;
        string severity;
        string targetType;
        uint256 timestamp;
        bool verified;
    }

    Report[] private reports;
    string[] private validCategories;

    event ReportSubmitted(uint256 indexed id, address indexed reporter);
    event ReportVerified(uint256 indexed id, address indexed verifier);

    constructor() {
        // seed some defaults
        validCategories.push("phishing");
        validCategories.push("malware");
        validCategories.push("social_engineering");
        validCategories.push("data_breach");
        validCategories.push("ransomware");
    }

    function submitReport(
        string memory reportHash,
        string memory category,
        string memory severity,
        string memory targetType
    ) public {
        uint256 id = reports.length + 1;
        reports.push(
            Report({
                id: id,
                reporter: msg.sender,
                reportHash: reportHash,
                category: category,
                severity: severity,
                targetType: targetType,
                timestamp: block.timestamp,
                verified: false
            })
        );
        emit ReportSubmitted(id, msg.sender);
    }

    function getAllReports()
        public
        view
        returns (Report[] memory)
    {
        return reports;
    }

    function getRecentReports(uint256 count)
        public
        view
        returns (Report[] memory)
    {
        if (count >= reports.length) {
            return reports;
        }
        Report[] memory recent = new Report[](count);
        uint256 start = reports.length - count;
        for (uint256 i = 0; i < count; i++) {
            recent[i] = reports[start + i];
        }
        return recent;
    }

    function getValidCategories() public view returns (string[] memory) {
        return validCategories;
    }

    function verifyReport(uint256 reportId) public {
        require(reportId > 0 && reportId <= reports.length, "invalid id");
        uint256 idx = reportId - 1;
        reports[idx].verified = true;
        emit ReportVerified(reportId, msg.sender);
    }

    function getReportCount() public view returns (uint256) {
        return reports.length;
    }
}
