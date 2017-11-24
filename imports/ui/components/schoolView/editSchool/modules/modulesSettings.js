import React from "react";

export default modulesSettings = {
    mainPanelHeader: {
        leftIcon: "assignment",
        title: "Modules",
        actions: {
            buttonTitle: "ADD Module",
            onSubmit: "addModule",
            title: "Module",
            formFields: [
                { key: "name", label: "Module Name", type: "text", required: true },
                // { key: "skillId", label: "Skill", type: "autoComplete", required: true },
                { key: "duration", label: "Duration (In Minutes)", type: "text", required: true },
                { key: "notes", label: "Notes", type: "textArea", required: true },
            ]
        }
    },
    mainTable: {
        title: "Modules",
        tableFields: [
            { key: "name", label: "Module Name" },
            { key: "duration", label: "Duration (In Minutes)" },
            { key: "notes", label: "Notes" },
        ],
        actions: {
            label: "Actions",
            toggleChildTable: true,
            edit: {
                title: "Edit Module",
                onSubmit: "editModule",
                editByField: "_id",
                formFields: [
                    { key: "name", label: "Module Name", type: "text", required: true },
                    // { key: "skillId", label: "Skill", type: "autoComplete", required: true },
                    { key: "duration", label: "Duration (In Minutes)", type: "text", required: true },
                    { key: "notes", label: "Notes", type: "textArea", required: true },
                ]
            },
            delete: "removeModule",
        }
    }
}