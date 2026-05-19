
import { useState } from "react";
import Form, {
  Item,
  GroupItem,
  RequiredRule
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { createJob } from "../../../api/jobApi";
import toast from "react-hot-toast";
import validationEngine from "devextreme/ui/validation_engine";

export default function PostJob({ onJobCreated }) {
  const [job, setJob] = useState({
    title: "",
    description: "",
    budget: null,
    location: "",
    skills: ""
  });

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async () => {

    const result = validationEngine.validateGroup("jobForm");

    if (!result.isValid) {
      toast.error("Please fill required details with valid data");
      return;
    }
    try {
      await createJob(job);

      toast.success("Job posted successfully");
      validationEngine.resetGroup("jobForm");

      // // reset form
      // setJob({
      //   title: "",
      //   description: "",
      //   budget: null,
      //   location: "",
      //   skills: ""
      // });

      // // refresh parent (dashboard)
      onJobCreated && onJobCreated();

      

    } catch (err) {
      
      console.error(err);
      toast.error("Failed to post job");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Post a Job</h2>

      <Form
        formData={job}
        colCount={2}
        validationGroup = "jobForm"
        showValidatoinSummary={false}
        onFieldDataChanged={(e) => {
          setJob((prev) => ({
            ...prev,
            [e.dataField]: e.value
          }));
        }}
      >
        <GroupItem colCount={2} caption="Job Details">

          {/* TITLE */}
          <Item dataField="title">
            <RequiredRule message="Title is required" />
          </Item>

          {/* BUDGET */}
          <Item
            dataField="budget"
            editorType="dxNumberBox"
            editorOptions={{
              
              showSpinButtons: true,
              format: "#,##0",
              RequiredRule:"asd",
              
            }}
          >
            {/* <RequiredRule message="Budget is required" /> */}
          </Item>

          {/* LOCATION */}
          <Item dataField="location" colSpan={2}>
            <RequiredRule message="Location is required" />
          </Item>

          {/* SKILLS */}
          <Item
            dataField="skills"
            colSpan={2}
            editorOptions={{
              placeholder: "React, Node, SQL..."
            }}
          />

          {/* DESCRIPTION */}
          <Item
            dataField="description"
            colSpan={2}
            editorType="dxTextArea"
            editorOptions={{
              height: 120
            }}
          >
            <RequiredRule message="Description is required" />
          </Item>

        </GroupItem>
      </Form>

      {/* SUBMIT BUTTON */}
      <Button
        text="Post Job"
        type="success"
        stylingMode="contained"
        onClick={handleSubmit}
      />
    </div>
  );
}