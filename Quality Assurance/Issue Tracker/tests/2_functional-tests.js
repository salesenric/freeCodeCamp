const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  const project = 'TestProject';
  let issueId;

  // Test creating an issue with every field
  test('Create an issue with every field', function(done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: 'Test Issue',
        issue_text: 'This is a test issue.',
        created_by: 'User',
        assigned_to: 'Assignee',
        status_text: 'In Progress',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.isTrue(res.body.open);
        issueId = res.body._id; // Save the created issue ID for later tests
        done();
      });
  });

  // Test creating an issue with only required fields
  test('Create an issue with only required fields', function(done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: 'Another Test Issue',
        issue_text: 'This issue only has required fields.',
        created_by: 'User',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.isTrue(res.body.open);
        done();
      });
  });

  // Test creating an issue with missing required fields
  test('Create an issue with missing required fields', function(done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: '',
        issue_text: 'Missing title.',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      });
  });

  // Test viewing issues on a project
  test('View issues on a project', function(done) {
    chai.request(server)
      .get(`/api/issues/${project}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // Test viewing issues with one filter
  test('View issues on a project with one filter', function(done) {
    chai.request(server)
      .get(`/api/issues/${project}?open=true`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // Test viewing issues with multiple filters
  test('View issues on a project with multiple filters', function(done) {
    chai.request(server)
      .get(`/api/issues/${project}?open=true&assigned_to=Assignee`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // Test updating one field on an issue
  test('Update one field on an issue', function(done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: issueId,
        issue_title: 'Updated Title',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: issueId });
        done();
      });
  });

  // Test updating multiple fields on an issue
  test('Update multiple fields on an issue', function(done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: issueId,
        issue_text: 'Updated issue text',
        assigned_to: 'New Assignee',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: issueId });
        done();
      });
  });

  // Test updating an issue with missing _id
  test('Update an issue with missing _id', function(done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        issue_title: 'Title without ID',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

  // Test updating an issue with no fields to update
  test('Update an issue with no fields to update', function(done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: issueId,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: issueId });
        done();
      });
  });

  // Test updating an issue with an invalid _id
  test('Update an issue with an invalid _id', function(done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: 'invalid_id',
        issue_text: 'This should fail.',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', _id: 'invalid_id' });
        done();
      });
  });

  // Test deleting an issue
  test('Delete an issue', function(done) {
    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({ _id: issueId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: issueId });
        done();
      });
  });

  // Test deleting an issue with missing _id
  test('Delete an issue with missing _id', function(done) {
    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });
});
