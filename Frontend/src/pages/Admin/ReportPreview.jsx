import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import toast from "react-hot-toast";

import axiosClient from "../../api/axiosClient";

export default function ReportPreview() {

  const { type } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState([]);

  const [title, setTitle] =
    useState("");

  // ===================================
  // LOAD REPORT
  // ===================================

  useEffect(() => {

    loadReport();

  }, [type]);

  const loadReport = async () => {

    try {

      setLoading(true);

      let endpoint = "";

      switch(type)
      {
        case "jobs":
          endpoint =
            "/Admin/jobs-report-preview";
          setTitle("Jobs Report");
          break;

        case "users":
          endpoint =
            "/Admin/users-report-preview";
          setTitle("Users Report");
          break;

        case "moderation":
          endpoint =
            "/Admin/moderation-report-preview";
          setTitle("Moderation Report");
          break;

        case "categories":
          endpoint =
            "/Admin/categories-report-preview";
          setTitle("Report Categories");
          break;

        case "timeline":
          endpoint =
            "/Admin/timeline-report-preview";
          setTitle("Reports Timeline");
          break;

        default:
          return;
      }

      const response =
        await axiosClient.get(endpoint);

      setData(response.data.data || response.data );

    }
    catch(err)
    {
      console.error(err);

      toast.error(
        "Failed to load report preview"
      );
    }
    finally
    {
      setLoading(false);
    }
  };

  // ===================================
  // EXPORT REPORT
  // ===================================

  const exportReport = async () => {

    try {

      let endpoint = "";
      let filename = "";

      switch(type)
      {
        case "jobs":
          endpoint =
            "/Admin/export/jobs";

          filename =
            "jobs-report.xlsx";

          break;

        case "users":
          endpoint =
            "/Admin/export/users";

          filename =
            "users-report.xlsx";

          break;

        case "moderation":
          endpoint =
            "/Admin/export/moderation";

          filename =
            "moderation-report.xlsx";

          break;

        case "categories":
          endpoint =
            "/Admin/export/categories";

          filename =
            "report-categories.xlsx";

          break;

        case "timeline":
          endpoint =
            "/Admin/export/timeline";

          filename =
            "reports-timeline.xlsx";

          break;

        default:
          return;
      }

      const response =
        await axiosClient.get(endpoint, {
          responseType: "blob"
        });

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        filename
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success(
        "Report exported"
      );

    }
    catch(err)
    {
      console.error(err);

      toast.error(
        "Export failed"
      );
    }
  };

  // ===================================
  // LOADING
  // ===================================

  if(loading)
  {
    return (

      <div className="
        bg-white
        p-8
        rounded-2xl
        shadow
      ">

        <p className="
          text-slate-500
        ">
          Loading report...
        </p>

      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="
        bg-white
        p-6
        rounded-2xl
        shadow
        flex
        justify-between
        items-center
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-slate-800
          ">
            {title}
          </h1>

          <p className="
            text-slate-500
            mt-2
          ">
            Preview report data before export
          </p>

        </div>

        <button
          onClick={exportReport}

          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          Export Excel
        </button>

      </div>

      {/* TABLE */}

      <div className="
        bg-white
        rounded-2xl
        shadow
        overflow-hidden
      ">

        <div className="
          overflow-x-auto
        ">

          <table className="
            min-w-full
            divide-y
            divide-slate-200
          ">

            <thead className="
              bg-slate-50
            ">

              <tr>

                {data.length > 0 &&
                  Object.keys(data[0]).map(
                    (key) => (

                    <th
                      key={key}

                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      {key}
                    </th>

                  ))}

              </tr>

            </thead>

            <tbody className="
              divide-y
              divide-slate-100
            ">

              {data.map((row, index) => (

                <tr
                  key={index}

                  className="
                    hover:bg-slate-50
                  "
                >

                  {Object.values(row).map(
                    (value, i) => (

                    <td
                      key={i}

                      className="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        text-slate-700
                      "
                    >
                      {String(value)}
                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}