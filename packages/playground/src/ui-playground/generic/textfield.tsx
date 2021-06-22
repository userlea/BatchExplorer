import * as React from "react";
import { DemoPane } from "../layout/demo-pane";
import { TextField } from '@fluentui/react/lib/TextField';
import {
    ChoiceGroup,
    IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import { ChoiceGroupOnChange } from "../functions";
import {
    Toggle,
} from "@fluentui/react/lib/index";
export const TextFieldDemo: React.FC = () => {

    const [disabledKey, setDisabledKey] = React.useState<string | undefined>(
        "nondisabled"
    );

    const disabledOptions: IChoiceGroupOption[] = [
        { key: "nondisabled", text: "nondisabled" },
        { key: "disabled", text: "disabled" },
    ];

    const [required, setRequired] = React.useState(false);

    const onRequiredChange = React.useCallback(
        (ev, checked?: boolean) => setRequired(!!checked),
        []
    );

    return <DemoPane title="Textfield">
        <div style={{ display: "flex" }}>
            <TextField
                label="Textfield"
                value="This is a text field"
                // onChange={() => {}}
                disabled={disabledKey == "disabled"}
                required={required}
            />

        </div>
        <ChoiceGroup
                selectedKey={disabledKey}
                options={disabledOptions}
                onChange={ChoiceGroupOnChange(setDisabledKey)}
                label="Disabled status"
            />

            <Toggle
                label="Required? True or False"
                onChange={onRequiredChange}
                checked={required}
            />
    </DemoPane>;
};
