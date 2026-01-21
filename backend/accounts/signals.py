from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import send_mail


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """Envia e-mail de boas-vindas quando um usuário é criado."""
    if created:
        subject = 'Welcome to the Wall!'
        message = f'Hello {instance.username}, your account has been created successfully! Welcome to the Wall!'
        recipient_list = [instance.email]

        send_mail(subject, message, None, recipient_list)
