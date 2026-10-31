import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { socialService } from '../src/services/socialService.js';

describe('Social & Community Service', () => {
  test('Initial buddies exist with activity logs', () => {
    const buddies = socialService.getBuddies();
    assert.ok(buddies.length >= 3);
    assert.ok(buddies[0].handle.startsWith('@'));
  });

  test('Adding a buddy creates valid user with handle', () => {
    const newBuddy = socialService.addBuddy('@iron_athlete');
    assert.equal(newBuddy.handle, '@iron_athlete');
    assert.equal(newBuddy.cheersCount, 0);
  });

  test('Sending a cheer increments buddy cheers count', () => {
    const buddies = socialService.getBuddies();
    const target = buddies[0];
    const initialCheers = target.cheersCount;

    const updated = socialService.sendCheer(target.id);
    assert.equal(updated.cheersCount, initialCheers + 1);
    assert.equal(updated.isCheered, true);
  });

  test('Creating a team generates unique team code and joins creator', () => {
    const team = socialService.createTeam({
      name: 'Olympus Lifting Club',
      description: 'Heavy squats and deadlifts.',
      code: 'OLYMPUS'
    });

    assert.equal(team.name, 'Olympus Lifting Club');
    assert.equal(team.code, 'OLYMPUS');
    assert.equal(team.isMember, true);
    assert.equal(team.membersCount, 1);
  });

  test('Joining team by valid code adds member', () => {
    const team = socialService.createTeam({
      name: 'Spartan Cardio',
      description: 'Metabolic circuits.',
      code: 'SPARTA'
    });
    team.isMember = false; // reset for test
    const initialCount = team.membersCount;

    const joined = socialService.joinTeamByCode('SPARTA');
    assert.ok(joined);
    assert.equal(joined.isMember, true);
    assert.equal(joined.membersCount, initialCount + 1);
  });

  test('Leaderboard orders teams by weekly volume descending', () => {
    const leaderboard = socialService.getLeaderboard();
    assert.ok(leaderboard.length >= 2);
    assert.ok((leaderboard[0].weeklyVolumeKg || 0) >= (leaderboard[1].weeklyVolumeKg || 0));
  });

  test('Kudos toggling increments and decrements count', () => {
    const feed = socialService.getFeed();
    const post = feed[0];
    const initialKudos = post.kudosCount;

    const toggledOn = socialService.toggleKudos(post.id);
    assert.equal(toggledOn.kudosCount, initialKudos + 1);
    assert.equal(toggledOn.hasKudoed, true);

    const toggledOff = socialService.toggleKudos(post.id);
    assert.equal(toggledOff.kudosCount, initialKudos);
    assert.equal(toggledOff.hasKudoed, false);
  });

  test('Adding, reporting and deleting comments', () => {
    const feed = socialService.getFeed();
    const post = feed[0];

    // Add
    const comment = socialService.addComment(post.id, 'Alex Demo', 'Awesome work out there!');
    assert.ok(comment);
    assert.equal(comment.authorName, 'Alex Demo');
    assert.equal(comment.isOwn, true);

    // Report
    const reported = socialService.reportComment(post.id, comment.id);
    assert.equal(reported, true);

    // Delete
    const deleted = socialService.deleteComment(post.id, comment.id);
    assert.equal(deleted, true);
  });
});
