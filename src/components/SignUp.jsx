import React from 'react';
import { Form, Button, Row, Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import useAuth from '../hooks/index';
import routes from '../routes';
import { authorizeUser } from '../utils';
import { useTranslation } from 'react-i18next';


const SignUp = () => {
  const history = useHistory();
  const location = useLocation();
  const auth = useAuth();
  const { t } = useTranslation();

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .min(3, t('signUpPage.username.min_len'))
      .max(20, t('signUpPage.username.max_len'))
      .required(),
    password: yup.string().min(6, t('signUpPage.password.min_len')).required(),
    confirmPassword: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', t('signUpPage.the_pass_field_is_not_the_same_with_confirm_field'));
        return setSubmitting(false);
      }

      try {
        await authorizeUser({
          auth, history, from,
          url: routes.signUpPath(),
          username: values.username,
          password: values.password,
        });
      } catch(e) {
        console.log(e);
        if (e.response && e.response.status === 409) {
          setFieldError('username', t('signUpPage.user_already_exist'))
        } else {
          setFieldError('username', t('signUpPage.registration_failed'));
        }
      }
      setSubmitting(false);
    },
  });

  const { from } = location.state || { from: { pathname: "/" } };

  return (
    <Container>
      <Row className="justify-content-center pt-5">
          <h2>{t('Sign Up Form')}</h2>
      </Row>
      <Row className="justify-content-center pt-5">
        <div className="col-sm-4">
          <Form className="p-3" onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="username">{t('signUpPage.username.field_name')}</Form.Label>
              <Form.Control
                id="username"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                isInvalid={formik.errors.username && formik.touched.username || false}
                autoComplete="username"
                required={true}
                placeholder={t('username')}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">{t('password')}</Form.Label>
              <Form.Control
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  isInvalid={formik.errors.password && formik.touched.password || false}
                  autoComplete="password"
                  required={true}
                  placeholder={t('password')}
                  type="password"
                />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">{t('confirmPassword')}</Form.Label>
              <Form.Control
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword || false}
                  autoComplete="confirmPassword"
                  required={true}
                  placeholder={t('confirmPassword')}
                  type="password"
                />
              <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
              >{formik.isSubmitting ? t('Submitting…') : t('Submit')}
            </Button>
          </Form>
        </div>
      </Row>
      </Container>
  );
}


export default SignUp;