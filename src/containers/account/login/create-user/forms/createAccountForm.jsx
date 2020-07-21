import React from 'react';
import { Form, Formik } from 'formik';
import CustomInput from '../../../../components/custom-input';
import Button from '../../../../components/button';

export default function CreateAccount(props) {
  const { isPending, onSubmit } = props;

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmit}
    >
      <Form className="active">
        <CustomInput
          className="form-control"
          name="secretPhrase"
          label="Secret Phrase"
          placeholder="Secret Phrase"
          type="password"
        />
        <Button
          type="submit"
          name="Create New Account"
          isLoading={isPending}
        />
      </Form>
    </Formik>
  );
}