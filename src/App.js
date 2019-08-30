import React from "react";
import "./App.css";
let JSONForms = require("./mock/forms");

const InputField = ({ name, type, handleInputChange, value }) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={handleInputChange}
    />
  );
};

const TextAreaField = ({ name, value, handleInputChange }) => {
return <textarea name={name} value={value} onChange={handleInputChange}/>;
};

const SelectField = ({ name, options, value, handleInputChange }) => {
  return (
    <select onChange={handleInputChange} name={name} value={value}>
      <option>Please select an option...</option>
      {options.map(op => (
        <option key={op} value={op}>{op}</option>
      ))}
    </select>
  );
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: JSONForms,
      selectedForm: {
        name: "basicInfo",
        form: JSONForms.basicInfo,
        formData: ""
      }
    };
  }

  handleInputChange = e => {
    e.persist();
    let newForm = {
      [this.state.selectedForm.name]: this.state.forms[
        this.state.selectedForm.name
      ].map(field => {
        if (field.name === e.target.name) {
          field.value = e.target.value;
        }
        return field;
      })
    };
    return this.setState(prevState => ({
      forms: {
        ...prevState.forms,
        ...newForm
      }
    }));
  };

  renderFields = (fields, handleInputChange) => {
    return (
      <form>
        {fields.map((f, i) => {
          const { name, el, type, options, value } = f;
          const fieldMap = {
            input: InputField,
            textarea: TextAreaField,
            select: SelectField
          };
          return (
            <div key={name}>
              <label>{name}</label>
              {React.createElement(fieldMap[el], {
                name,
                value,
                type,
                options,
                handleInputChange
              })}
            </div>
          );
        })}
      </form>
    );
  };

  handleChange = e => {
    this.setState({
      selectedForm: {
        name: e.target.value,
        form: this.state.forms[e.target.value]
      }
    });
  };

  render() {
    return (
      <div className="form-app-container">
        <div className="info-container">
          <div>
            <p>
              Select form the dropdown to programtically generate a form from
              JSON.
            </p>
            <select onChange={this.handleChange}>
              {Object.keys(this.state.forms).map(form => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>
          <div style={{ overflow: "hidden" }}>
            <pre>
              <code>{JSON.stringify(this.state.forms, null, 2)}</code>
            </pre>
          </div>
        </div>
        <div className="form-container">
          {this.state.selectedForm !== undefined &&
            this.renderFields(
              this.state.selectedForm.form,
              this.handleInputChange
            )}
        </div>
      </div>
    );
  }
}
