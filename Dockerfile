FROM ubuntu:16.04

MAINTAINER Aleena Ma
RUN apt-get update
RUN apt-get install -y openjdk-8-jdk
RUN apt-get install -y python