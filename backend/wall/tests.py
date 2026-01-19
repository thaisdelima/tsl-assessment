from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class WallAPITests(APITestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'StrongPass123!'
        self.email = 'test@example.com'
        self.user = User.objects.create_user(
            username=self.username, 
            email=self.email, 
            password=self.password
        )
        self.messages_url = '/api/messages/'
        self.token = Token.objects.create(user=self.user)

    def test_post_message_authenticated(self):
        """Usuário autenticado consegue postar na wall."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        message_data = {'content': 'Testing allauth integration!'}
        response = self.client.post(self.messages_url, message_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user'], self.username)

    def test_list_messages_anonymous(self):
        """Ensure that guests can still see the wall"""
        response = self.client.get(self.messages_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)