FROM python:3.7

ENV PYTHONUNBUFFERED 1
RUN groupadd -g 1000 appuser && useradd -r -u 1000 -g appuser appuser
RUN mkdir /app && chown appuser -R /app
WORKDIR /app
ENV HOME /app
ENV PATH "/app/.local/bin:${PATH}"

COPY --chown=appuser ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install gunicorn

COPY --chown=appuser . /app/
EXPOSE 8000
USER appuser

CMD ["gunicorn", "-b", "0.0.0.0:8000", "-t", "120", "api.wsgi"]
