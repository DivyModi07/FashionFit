from django.db import models

class Student(models.Model):
    sid = models.AutoField(primary_key=True)
    sname = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.sid} - {self.sname}"
