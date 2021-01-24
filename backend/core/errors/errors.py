class ErrorFactory:
    def user_does_not_exist(self, user_id):
        return f'User does not exists with id: {user_id}'

    def username_or_password_incorrect(self):
        return f'Username or password incorrect'

    def user_is_not_logged(self, user):
        return f'User with: {user.id} is not logged in'

    def task_not_exists_for_id(self, task_id):
        return f'Task with: {task_id} does not exist'

    def text_too_long(self, text, max_chars):
        return f'Text: "{text}" is too long. Max length {max_chars}. Current length: {len(text)}'

    def string_is_empty(self, field_name):
        return f'Required field: {field_name} is empty'
