import React from "react";
import "./App.css";
let JSONForms = require("./mock/forms");

const InputField = ({ name, type, handleInputChange, value }) => {
  return (
    <input name={name} type={type} value={value} onChange={handleInputChange} />
  );
};

const TextAreaField = ({ name, value, handleInputChange }) => {
  return <textarea name={name} value={value} onChange={handleInputChange} />;
};

const SelectField = ({ name, options, value, handleInputChange }) => {
  return (
    <select onChange={handleInputChange} name={name} value={value}>
      <option>Please select an option...</option>
      {options.map(op => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: JSONForms,
      selectedForm: null,
      formData: {}
    };
  }

  // componentDidMount() {
  //   Object.keys(JSONForms).map(key =>
  //     this.setState(prevState => ({
  //       formData: {
  //         ...prevState.formData,
  //         [key]: {}
  //       }
  //     }))
  //   );
  // }

  handleInputChange = e => {
    e.persist();
    return this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [this.state.selectedForm.name]: {
          ...prevState.formData[this.state.selectedForm.name],
          [e.target.name]: e.target.value
        }
      },
      value: e.target.value
    }));
  };

  renderFields = (fields, handleInputChange) => {
    return (
      <form>
        {fields.map((f, i) => {
          const { name, el, type, options } = f;
          const fieldMap = {
            input: InputField,
            textarea: TextAreaField,
            select: SelectField
          };
          const value = this.state.formData[this.state.selectedForm.name].name;
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
    e.persist();
    this.setState({
      selectedForm: {
        name: e.target.value,
        form: this.state.forms[e.target.value]
      }
    });
    return Object.values(this.state.forms[e.target.value]).map(field => {
      return this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          [e.target.value]: {
            ...prevState.formData[e.target.value],
            [field.name]: ""
          }
        }
      }));
    });
  };

  render() {
    return (
      <div className="form-app-container">
        <div className="info-container">
          <div>
            <select onChange={this.handleChange}>
              <option>
                Select a form to programtically generate HTML from JSON...
              </option>
              {Object.keys(this.state.forms).map(form => (
                <option key={form} value={form}>
                  {form}
                </option>
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
          <>
            {this.state.selectedForm !== null &&
              this.renderFields(
                this.state.selectedForm.form,
                this.handleInputChange
              )}
          </>
          <div>
            <p>Captured Form Data</p>
            <pre>
              <code>{JSON.stringify(this.state.formData, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
