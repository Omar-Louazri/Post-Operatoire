from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PatientCareAssignment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("patient_code", models.CharField(db_index=True, max_length=50)),
                (
                    "contact",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assignments",
                        to="core.careteamcontact",
                    ),
                ),
                ("role_on_case", models.CharField(max_length=120)),
                ("notes", models.TextField(blank=True)),
                ("assigned_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["role_on_case"],
                "unique_together": {("patient_code", "contact")},
            },
        ),
    ]
