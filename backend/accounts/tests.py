from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.core import mail
from django.test import override_settings


class AccountsAPITests(APITestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'StrongPass123!'
        self.email = 'test@example.com'
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password,
        )
        self.register_url = '/api/auth/registration/'
        self.login_url = '/api/auth/login/'

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_registration_success(self):
        """Registro via dj-rest-auth envia chave e e-mail."""
        mail.outbox = []
        data = {
            'username': 'newbie',
            'email': 'newbie@example.com',
            'password1': 'Password123!',
            'password2': 'Password123!',
        }

        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('key', response.data)
        self.assertTrue(len(mail.outbox) > 0)

    def test_login_success(self):
        """Login retorna token."""
        login_data = {'username': self.username, 'password': self.password}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', response.data)
