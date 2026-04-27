from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="recoveryplantemplate",
            name="patient_code",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AddField(
            model_name="recoveryplantemplate",
            name="start_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
