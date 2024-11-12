import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [currentYear] = useState(new Date().getFullYear());
  const [listOfReport, setListOfReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showTable, setShowTable] = useState(false);

  const monthMapping = {
    January: "jan",
    February: "feb",
    March: "mar",
    April: "apr",
    May: "may",
    June: "jun",
    July: "jul",
    August: "aug",
    September: "sep",
    October: "oct",
    November: "nov",
    December: "dec",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/reports")
      .then((response) => {
        const filtered = response.data.filter(
          (report) => new Date(report.createdAt).getFullYear() === currentYear
        );
        setListOfReport(filtered);
        setFilteredReport(filtered);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [currentYear]);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (month === "") {
      setFilteredReport(listOfReport);
    } else {
      const filteredByMonth = listOfReport.filter(
        (report) => report.month === month
      );
      setFilteredReport(filteredByMonth);
    }
  };

  const handleViewReport = (e) => {
    e.preventDefault();

    const reportTotal = listOfReport.map((report) => ({
      ...report,
      totalBonus: (
        (parseInt(report.bonus_ontime.replace(/,/g, "")) || 0) +
        (parseInt(report.bonus_late.replace(/,/g, "")) || 0)
      ).toLocaleString("en-US"),
    }));
    setFilteredReport(reportTotal);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Laporan Bonus</h3>
        <form className="row g-3" onSubmit={handleViewReport}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="month"> Bulan </label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              required
            >
              <option hidden>---Please Choose Options---</option>
              {Object.keys(monthMapping).map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="year"> Tahun </label>
            <input
              type="text"
              className="form-control"
              value={currentYear}
              disabled
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Lihat Report
            </button>
          </div>
        </form>
        <br />
        <div className="row mt-3">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th rowSpan="2">Nomor</th>
                  <th rowSpan="2">Nama</th>
                  <th rowSpan="2">Pengurang(Hitungan Gaji)</th>
                  <th rowSpan="2">Bulan OnTime</th>
                  <th rowSpan="2">Bulan Late </th>
                  <th rowSpan="2">Bonus Komponen</th>
                  <th colSpan="2">Persentase</th>
                  <th colSpan="2">Kalkulasi Bonus</th>
                  <th colSpan="2">Bonus</th>
                  <th rowSpan="2">Total</th>
                </tr>
                <tr>
                  <th>OnTime</th>
                  <th>Late</th>
                  <th>OnTime</th>
                  <th>Late</th>
                  <th>OnTime</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredReport.map((report, index) => {
                  return (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>{report.employee_name}</td>
                      <td>{report.salary_deduction}</td>
                      <td>{report.month_ontime}</td>
                      <td>{report.month_late}</td>
                      <td>{report.bonus_component}</td>
                      <td>{report.percent_ontime}</td>
                      <td>{report.percent_late}</td>
                      <td>{report.total_ontime}</td>
                      <td>{report.total_late}</td>
                      <td>{report.bonus_ontime}</td>
                      <td>{report.bonus_late}</td>
                      <td>{report.totalBonus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;