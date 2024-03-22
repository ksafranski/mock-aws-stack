# Mock AWS Stack

This is a mock AWS stack that can be used for testing purposes. It is built using [LocalStack](https://www.localstack.cloud/)
and [Docker](https://www.docker.com/) with Docker Compose.

This base uses Node/TypeScript and runs tests (in watch mode). This can be modified to fit the needs of the project.

## Services

The base version of the repo comes with support for a number of AWS services. This can be expanded with the following:

1. Update the `docker-compose.yml` file to include the new service(s) in the `SERVICES` environment variable.
2. Modify the `startup.sh` script to add the proper AWS CLI commands to create the new service(s).
3. Add definitions to the services in the `/localstack` directory following the
   example of the existing services.

**NOTE:** For consistency and naming purposes, the service definitions should be named in the format `service_name.json` with underscores to separate words.

## Usage

Running `docker-compose up` will start the LocalStack container and start the services defined in the `docker-compose.yml` file running the default command.

To run specific commands (for example `yarn test:watch`) use:

```bash
docker compose run app yarn test:watch
```

There is a `run.sh` utility script that can be used as well:

```bash
./run.sh yarn test:watch
```
